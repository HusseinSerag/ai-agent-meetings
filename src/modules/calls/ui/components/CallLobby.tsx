interface CallLobbyProps {
  onJoin(): void;
}
import Link from "next/link";

import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { generateAvatarUri } from "@/lib/avatar";

function DisabledVideoPreview() {
  const { data } = authClient.useSession();
  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          image:
            data?.user.image ??
            generateAvatarUri({
              seed: data?.user.name ?? "",
              variant: "initials",
            }),
        } as StreamVideoParticipant
      }
    />
  );
}
function AllowBrowserPermission() {
  return (
    <p className="text-sm">
      Please grant your browser permission to access your camera and microphone.
    </p>
  );
}
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LogInIcon } from "lucide-react";
export function CallLobby({ onJoin }: CallLobbyProps) {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;
  return (
    <div className="flex flex-col items-center w-full justify-center min-h-screen bg-radial from-sidebar-accent to-sidebar">
      <div className="flex w-full flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
        <div className="flex flex-col gap-y-2 text-center">
          <h6 className="text-lg font-medium">Ready to join?</h6>
          <p className="text-sm">Set up your call before joining</p>
        </div>
        <VideoPreview
          className="max-w-full"
          DisabledVideoPreview={
            hasBrowserMediaPermission
              ? DisabledVideoPreview
              : AllowBrowserPermission
          }
        />
        <div className="flex gap-x-2">
          <ToggleAudioPreviewButton />
          <ToggleVideoPreviewButton />
        </div>
        <div className="flex gap-x-2 justify-between  w-full">
          <Button asChild variant={"ghost"}>
            <Link href={"/meetings"}>Cancel</Link>
          </Button>
          <Button onClick={onJoin}>
            <LogInIcon />
            Join Call
          </Button>
        </div>
      </div>
    </div>
  );
}
