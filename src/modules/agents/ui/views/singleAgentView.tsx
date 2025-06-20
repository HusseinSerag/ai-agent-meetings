"use client";
import { LoadingState } from "@/components/Loading";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import { useState } from "react";
import { UpdateSingleAgentDialog } from "../components/UpdateSingleAgentDialog";
import { Header } from "@/components/Header";

interface Props {
  agentId: string;
}

export function SingleAgentView({ agentId }: Props) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({
      id: agentId,
    })
  );
  const [editAgentDialogOpen, setEditAgentDialogOpen] = useState(false);
  const deleteAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.dashboard.getData.queryOptions({})
        );
        // TODO invalidate
        router.push("/agents");
      },
      onError(error) {
        toast.error(error.message);
      },
    })
  );
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove ${data.meetingCount} associated meeting`
  );

  async function handlerRemoveAgent() {
    const ok = await confirmRemove();
    if (!ok) return;
    deleteAgent.mutate({
      id: agentId,
    });
  }
  return (
    <>
      <RemoveConfirmation />
      <UpdateSingleAgentDialog
        open={editAgentDialogOpen}
        onOpenChange={setEditAgentDialogOpen}
        initialValues={data}
      />
      <div className="flex-1 py-4 px-3 md:px-8 flex flex-col gap-y-4">
        <Header
          onDelete={() => {
            handlerRemoveAgent();
          }}
          onEdit={() => {
            setEditAgentDialogOpen(true);
          }}
          breadCrumbLink="/agents"
          breadCrumbTitle="My Agents"
          currentPageLink={`/agents/${agentId}`}
          name={data.name}
        />

        <div className="bg-white rounded-lg border">
          <div className="px-4 py-5 gap-y-5 flex flex-col">
            <div className="flex items-center gap-x-3">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-10"
              />
              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>
            <Badge
              variant={"outline"}
              className="flex items-center gap-x-2 [&>svg]:size-4"
            >
              <VideoIcon className="text-blue-700" />
              {data.meetingCount}{" "}
              {data.meetingCount === 1 ? "meeting" : "meetings"}
            </Badge>
            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-medium">Instructions</p>
              <p className="text-neutral-800">{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function SingleAgentLoading() {
  return (
    <LoadingState
      title="Loading Agent"
      description="Please wait a few seconds"
    />
  );
}
