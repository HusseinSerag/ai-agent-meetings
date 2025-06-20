import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";

export async function getMeetingsCount(
  id: string,
  searchQuery?: string | null,
  status?: MeetingStatus | null,
  agentId?: string | null
) {
  return db
    .select({
      count: count(),
    })
    .from(meetings)
    .innerJoin(agents, eq(meetings.agentId, agents.id))
    .where(
      and(
        eq(meetings.userId, id),
        searchQuery ? ilike(meetings.name, `%${searchQuery}%`) : undefined,
        status ? eq(meetings.status, status) : undefined,
        agentId ? eq(meetings.agentId, agentId) : undefined
      )
    );
}
export async function getTotalMeetingsOfUser(id: string) {
  return db
    .select({
      count: count(),
    })
    .from(meetings)
    .where(eq(meetings.userId, id));
}
export const meetingsRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [deletedMeeting] = await db
        .delete(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();
      if (!deletedMeeting) {
        throw new TRPCError({
          message: "Meeting Not found!",
          code: "NOT_FOUND",
        });
      }
    }),
  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedMeeting] = await db
        .update(meetings)
        .set({
          ...input,
        })
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();
      if (!updatedMeeting) {
        throw new TRPCError({
          message: "Meeting Not found!",
          code: "NOT_FOUND",
        });
      }
    }),
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { agentId, name } = input;
      const {
        auth: {
          user: { id },
        },
      } = ctx;
      const [createdMeetings] = await db
        .insert(meetings)
        .values({
          agentId,
          name,
          userId: id,
        })
        .returning();

      // TODO: Create Stream Call, upsert Stream Users
      return {
        meetingId: createdMeetings.id,
      };
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const [meeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );
      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found!",
        });
      }
      return meeting;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled,
            MeetingStatus.Completed,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, status, agentId } = input;
      const [data, total, meetingCount] = await Promise.all([
        db
          .select({
            ...getTableColumns(meetings),
            agent: agents,
            duration:
              sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
                "duration"
              ),
          })
          .from(meetings)
          .innerJoin(agents, eq(meetings.agentId, agents.id))
          .where(
            and(
              eq(meetings.userId, ctx.auth.user.id),
              search ? ilike(meetings.name, `%${search}%`) : undefined,
              status ? eq(meetings.status, status) : undefined,
              agentId ? eq(meetings.agentId, agentId) : undefined
            )
          )
          .orderBy(desc(meetings.createdAt), desc(meetings.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        getMeetingsCount(ctx.auth.user.id, search, status, agentId),
        db.select().from(meetings).where(eq(meetings.userId, ctx.auth.user.id)),
      ]);

      const totalPages = Math.ceil(total[0].count / pageSize);
      return {
        items: data,
        total: total[0].count,
        totalPages,
        hasMeetings: meetingCount.length > 0,
      };
    }),
});
