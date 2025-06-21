import { auth } from "@/lib/auth";
import { CallView } from "@/modules/calls/ui/views/CallView";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}
export default async function CallPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/sign-in");
  }
  const { meetingId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <CallView meetingId={meetingId} />
      </Suspense>
    </HydrationBoundary>
  );
}
