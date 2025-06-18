import { ErrorState } from "@/components/Error";
import { LoadingState } from "@/components/Loading";
import { auth } from "@/lib/auth";
import { AgentsListHeader } from "@/modules/agents/ui/components/ListHeader";
import {
  AgentsError,
  AgentsLoading,
  AgentsView,
} from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function AgentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/sign-in");
  }
  const queryClient = getQueryClient();
  // prefetch data on server
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsLoading />}>
          <ErrorBoundary fallback={<AgentsError />}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
