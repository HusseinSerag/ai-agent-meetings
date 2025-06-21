"use client";

import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { LoaderIcon } from "lucide-react";
import { CallConnect } from "./CallConnect";

interface Props {
  meetingId: string;
  meetingName: string;
}

export function CallProvider({ meetingId, meetingName }: Props) {
  const { data, isPending } = authClient.useSession();
  if (!data || isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <CallConnect
      userImage={
        data.user.image ??
        generateAvatarUri({
          seed: data.user.name,
          variant: "initials",
        })
      }
      meetingId={meetingId}
      userId={data.user.id}
      userName={data.user.name}
      meetingName={meetingName}
    />
  );
}
