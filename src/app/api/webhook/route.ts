import { and, eq, not } from "drizzle-orm";
import {
  CallEndedEvent,
  MessageNewEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantLeftEvent,
  CallRecordingReadyEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { agents, meetings, user } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { sendEmail } from "@/lib/mailer";
import { inngest } from "@/inngest/client";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";

const openAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
function verifySignWithSDK(body: string, sign: string) {
  return streamVideo.verifyWebhook(body, sign);
}
export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");
  if (!signature || !apiKey) {
    return NextResponse.json(
      {
        error: "Missing signature or API key",
      },
      {
        status: 400,
      }
    );
  }

  const body = await req.text();
  if (!verifySignWithSDK(body, signature)) {
    return NextResponse.json(
      {
        error: "Invalid signature",
      },
      {
        status: 401,
      }
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid data",
      },
      {
        status: 400,
      }
    );
  }
  const eventType = (payload as Record<string, unknown>)?.type;
  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json(
        {
          error: "Missing meetingId",
        },
        {
          status: 400,
        }
      );
    }
    const [existingMeetings] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );

    if (!existingMeetings)
      return NextResponse.json(
        {
          error: "Meeting not found",
        },
        {
          status: 404,
        }
      );

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, existingMeetings.id));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeetings.agentId));
    if (!existingAgent)
      return NextResponse.json(
        {
          error: "Agent not found",
        },
        {
          status: 404,
        }
      );

    const call = streamVideo.video.call("default", meetingId);
    const realTimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
    });

    realTimeClient.updateSession({
      instructions: existingAgent.instructions,
    });
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json(
        {
          error: "Missing meetingId",
        },
        {
          status: 400,
        }
      );
    }
    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json(
        {
          error: "Missing meetingId",
        },
        {
          status: 400,
        }
      );
    }
    await db
      .update(meetings)
      .set({
        status: "processing",
        endedAt: new Date(),
      })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json(
        {
          error: "Missing meetingId",
        },
        {
          status: 400,
        }
      );
    }
    const [updatedMeeting] = await db
      .update(meetings)
      .set({
        transcriptUrl: event.call_transcription.url,
      })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updatedMeeting) {
      return NextResponse.json(
        {
          error: "Meeting not found!",
        },
        {
          status: 404,
        }
      );

      // send email to user that transcript is ready
    }
    await inngest.send({
      name: "meetings/processing",
      data: {
        meetingId: updatedMeeting.id,
        transcriptUrl: updatedMeeting.transcriptUrl,
      },
    });
    const [userInfo] = await db
      .select({
        email: user.email,
        name: user.name,
      })
      .from(user)
      .where(eq(user.id, updatedMeeting.userId));
    sendEmail(userInfo.email, "Transcript Ready", "confirmation-email", {
      content: "transcript",
      name: userInfo.name,
      url: updatedMeeting.transcriptUrl,
    });
    // send email to user
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];
    if (!meetingId) {
      return NextResponse.json(
        {
          error: "Missing meetingId",
        },
        {
          status: 400,
        }
      );
    }
    const [updatedMeeting] = await db
      .update(meetings)
      .set({
        recordingUrl: event.call_recording.url,
      })
      .where(eq(meetings.id, meetingId))
      .returning();
    if (!updatedMeeting) {
      return NextResponse.json(
        {
          error: "Meeting not found!",
        },
        {
          status: 404,
        }
      );
    }
    // send email to user that recording is ready
    const [userInfo] = await db
      .select({
        email: user.email,
        name: user.name,
      })
      .from(user)
      .where(eq(user.id, updatedMeeting.userId));
    sendEmail(userInfo.email, "Recording Ready", "confirmation-email", {
      content: "recording",
      name: userInfo.name,
      url: updatedMeeting.recordingUrl,
    });
  } else if (eventType === "message.new") {
    const event = payload as MessageNewEvent;
    const userId = event.user?.id;
    const channelId = event.channel_id;
    const text = event.message?.text;

    if (!userId || !channelId || !text) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }
    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));
    if (!existingMeeting) {
      return NextResponse.json(
        {
          error: "Meeting not found!",
        },
        {
          status: 404,
        }
      );
    }
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));
    if (!existingAgent) {
      return NextResponse.json(
        {
          error: "Agent not found!",
        },
        {
          status: 404,
        }
      );
    }
    if (userId !== existingAgent.id) {
      const instructions = `
      You are an AI assistant helping the user revisit a recently completed meeting.
      Below is a summary of the meeting, generated from the transcript:
      
      ${existingMeeting.summary}
      
      The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
      
      ${existingAgent.instructions}
      
      The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
      Always base your responses on the meeting summary above.
      
      You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
      
      If the summary does not contain enough information to answer a question, politely let the user know.
      
      Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
      `;
      const channel = streamChat.channel("messaging", channelId);
      await channel.watch();
      const previousMessages = channel.state.messages
        .slice(-5)
        .filter((msg) => msg.text && msg.text.trim() !== "")
        .map<ChatCompletionMessageParam>((msg) => ({
          role: msg.user?.id === existingAgent.id ? "assistant" : "user",
          content: msg.text || "",
        }));

      const res = await openAiClient.chat.completions.create({
        messages: [
          {
            role: "system",
            content: instructions,
          },
          ...previousMessages,
          {
            role: "user",
            content: text,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      const textRes = res.choices[0].message.content;
      if (!textRes) {
        return NextResponse.json(
          {
            error: "No response for GPT",
          },
          {
            status: 400,
          }
        );
      }
      const avatarUrl = generateAvatarUri({
        seed: existingAgent.name,
        variant: "botttsNeutral",
      });

      streamChat.upsertUser({
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarUrl,
      });
      channel.sendMessage({
        text: textRes,
        user: {
          id: existingAgent.id,
          name: existingAgent.name,
          image: avatarUrl,
        },
      });
    }
  }

  return NextResponse.json({
    status: "ok",
  });
}
