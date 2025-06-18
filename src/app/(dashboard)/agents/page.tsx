import { ErrorState } from "@/components/Error";
import { LoadingState } from "@/components/Loading";
import {
  AgentsError,
  AgentsLoading,
  AgentsView,
} from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function AgentsPage() {
  const queryClient = getQueryClient();
  // prefetch data on server
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsLoading />}>
        <ErrorBoundary fallback={<AgentsError />}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
