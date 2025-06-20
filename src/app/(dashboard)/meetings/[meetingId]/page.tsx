import { ErrorBoundaryFallback } from "@/components/ErrorBoundaryFallback";
import { auth } from "@/lib/auth";
import {
  SingleMeetingLoading,
  SingleMeetingView,
} from "@/modules/meetings/ui/views/SingleMeetingView";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}
export default async function SingleMeetingPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/sign-in");
  }
  const queryClient = getQueryClient();
  const { meetingId } = await params;
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    })
  );
  // TODO: Prefetch meeting.getTranscript
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<SingleMeetingLoading />}>
        <ErrorBoundary fallbackRender={ErrorBoundaryFallback}>
          <SingleMeetingView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
