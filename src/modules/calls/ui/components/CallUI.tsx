import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./CallLobby";
import { CallActive } from "./CallActive";
import { CallEnded } from "./CallEnded";
import { useTRPC } from "@/trpc/client";

interface Props {
  meetingName: string;
}

export function CallUI({ meetingName }: Props) {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  async function handleJoin() {
    if (!call) return;
    await call.join();
    setShow("call");
  }
  async function handleLeave() {
    if (!call) return;
    await call.endCall();
    setShow("ended");
  }
  return (
    <StreamTheme className="min-h-full">
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && (
        <CallActive meetingName={meetingName} onleave={handleLeave} />
      )}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  );
}
