import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import { auth } from "@/lib/auth";
import { loadSeachParams } from "@/modules/agents/params";
import { getAgentCount } from "@/modules/agents/server/procedures";
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
import { SearchParams } from "nuqs";
import { createSearchParamsCache } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  searchParams: Promise<SearchParams>;
}
export default async function AgentsPage({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/sign-in");
  }
  let params = await loadSeachParams(searchParams);

  const queryClient = getQueryClient();
  const [count] = await getAgentCount(session.user.id, params.search);
  const totalPages = Math.ceil(count.count / DEFAULT_PAGE_SIZE);
  const correctedPage =
    params.page <= 0
      ? DEFAULT_PAGE
      : params.page > totalPages
      ? totalPages
      : params.page;

  if (params.page !== correctedPage) {
    const newParams = new URLSearchParams();
    for (let key in params) {
      newParams.set(key, String(params[key as keyof typeof params]));
    }
    newParams.set("page", correctedPage.toString());
    redirect(`?${newParams.toString()}`);
  }
  // prefetch data on server
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({
      ...params,
    })
  );
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
