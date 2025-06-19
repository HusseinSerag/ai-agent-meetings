import { ErrorBoundaryFallback } from "@/components/ErrorBoundaryFallback";
import {
  SingleAgentLoading,
  SingleAgentView,
} from "@/modules/agents/ui/views/singleAgentView";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{ agentId: string }>;
}

export default async function SingleAgentPage({ params }: Props) {
  const { agentId } = await params;
  const queryClient = getQueryClient();
  // fix prefetch issue
  try {
    await queryClient.prefetchQuery(
      trpc.agents.getOne.queryOptions({
        id: agentId,
      })
    );
  } catch (e) {
    // throw e;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallbackRender={ErrorBoundaryFallback}>
        <Suspense fallback={<SingleAgentLoading />}>
          <SingleAgentView agentId={agentId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
