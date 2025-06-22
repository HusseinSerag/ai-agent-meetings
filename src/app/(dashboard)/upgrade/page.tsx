import { auth } from "@/lib/auth";
import {
  UpgradeError,
  UpgradeLoading,
  UpgradeView,
} from "@/modules/premium/ui/views/UpgradeView";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function UpgradePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/sign-in");
  }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.premium.getCurrentSubscription.queryOptions()
  );
  void queryClient.prefetchQuery(trpc.premium.getProducts.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<UpgradeLoading />}>
        <ErrorBoundary fallbackRender={UpgradeError}>
          <UpgradeView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
