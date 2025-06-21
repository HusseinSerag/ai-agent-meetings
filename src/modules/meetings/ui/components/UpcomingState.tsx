import { EmptyState } from "@/components/Empty";
import { Button } from "@/components/ui/button";
import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
interface UpcomingStateProps {
  meetingId: string;
  onCancelMeeting(): void;
  isCancelling: boolean;
}
export function UpcomingState({
  meetingId,
  isCancelling,
  onCancelMeeting,
}: UpcomingStateProps) {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        description="When you start a meeting, a summary will appear here"
        title="Meeting hasn't started yet"
        image="/upcoming.svg"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2">
        <Button
          onClick={onCancelMeeting}
          disabled={isCancelling}
          className="w-full lg:w-auto"
          variant={"secondary"}
        >
          <BanIcon />
          Cancel meeting
        </Button>
        <Button disabled={isCancelling} className="w-full lg:w-auto" asChild>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  );
}
