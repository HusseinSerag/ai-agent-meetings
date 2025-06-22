import { LoadingState } from "@/components/Loading";
import { authClient } from "@/lib/auth-client";
import { ChatUI } from "./ChatUI";
import { generateAvatarUri } from "@/lib/avatar";
import { user } from "@/db/schema";

interface Props {
  meetingId: string;
  meetingName: string;
}

export function ChatProvider({ meetingId, meetingName }: Props) {
  const { data, isPending } = authClient.useSession();
  if (isPending) {
    return (
      <LoadingState
        title="Loading..."
        description="Please wait while we load the chat"
      />
    );
  }
  if (!data) return null;
  return (
    <ChatUI
      meetingId={meetingId}
      meetingName={meetingName}
      userId={data?.user.id}
      userName={data?.user.name}
      userImage={
        data.user.image ??
        generateAvatarUri({
          seed: data.user.name,
          variant: "initials",
        })
      }
    />
  );
}
