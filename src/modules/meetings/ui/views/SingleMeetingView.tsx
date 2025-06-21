"use client";
import { LoadingState } from "@/components/Loading";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";
import { MeetingsForm } from "../components/MeetingForm";
import { UpdateSingleMeetingDialog } from "../components/UpdateSingleMeetingDialog";
import { useState } from "react";
import { toast } from "sonner";
import { UpcomingState } from "../components/UpcomingState";
import { ActiveState } from "../components/ActiveState";
import { CancelledState } from "../components/CancelledState";
import { ProcessingState } from "../components/ProcessingState";
interface SingleMeetingViewProps {
  meetingId: string;
}
export function SingleMeetingView({ meetingId }: SingleMeetingViewProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    })
  );
  const router = useRouter();
  const queryClient = useQueryClient();
  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.dashboard.getData.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );

        router.push("/meetings");
      },
      onError(error) {
        toast.error(error.message);
      },
    })
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove this meeting`
  );
  async function handleDelete() {
    const res = await confirmRemove();
    if (!res) return;
    removeMeeting.mutate({
      id: meetingId,
    });
  }
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <RemoveConfirmation />
      <UpdateSingleMeetingDialog
        open={openDialog}
        initialValues={data}
        onOpenChange={setOpenDialog}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <Header
          onDelete={() => {
            handleDelete();
          }}
          onEdit={() => {
            setOpenDialog(true);
          }}
          breadCrumbLink="/meetings"
          breadCrumbTitle="My Meetings"
          currentPageLink={`/meetings/${meetingId}`}
          name={data.name}
        />
        {data.status === "cancelled" && <CancelledState />}
        {data.status === "upcoming" && (
          <UpcomingState
            isCancelling={false}
            onCancelMeeting={() => {}}
            meetingId={meetingId}
          />
        )}
        {data.status === "processing" && <ProcessingState />}
        {data.status === "active" && <ActiveState meetingId={meetingId} />}
        {data.status === "completed" && <div>completed</div>}
      </div>
    </>
  );
}
export function SingleMeetingLoading() {
  return (
    <LoadingState
      title="Loading Meeting"
      description="Please wait a few seconds"
    />
  );
}
