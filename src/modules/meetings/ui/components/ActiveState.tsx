import { EmptyState } from "@/components/Empty";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface ActiveStateProps {
  meetingId: string;
}
export function ActiveState({ meetingId }: ActiveStateProps) {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        description="Meeting will end once all participants exit the meeting"
        title="Meeting is active"
        image="/upcoming.svg"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2">
        <Button className="w-full lg:w-auto" asChild>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Join meeting
          </Link>
        </Button>
      </div>
    </div>
  );
}
