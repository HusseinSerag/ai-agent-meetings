"use client";

import { ErrorState } from "@/components/Error";
import { LoadingState } from "@/components/Loading";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PricingCard } from "../components/PricingCard";

export function UpgradeView() {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.premium.getProducts.queryOptions()
  );
  const { data: subscriptions } = useSuspenseQuery(
    trpc.premium.getCurrentSubscription.queryOptions()
  );

  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-10">
      <div className="mt-4 flex-1 flex flex-col gap-y-10 items-center">
        <h5 className="font-medium text-2xl md:text-3xl">
          You are on the{" "}
          <span className="font-semibold text-primary">
            {subscriptions?.name ?? "Free"}
          </span>{" "}
          plan
        </h5>
        <div className="flex justify-center flex-wrap gap-4">
          {products.map((product) => {
            const isCurrentProduct = subscriptions?.id === product.id;
            const isPremium = !!subscriptions;

            let buttonText = "Upgrade";
            let onClick = () =>
              authClient.checkout({
                products: [product.id],
              });
            if (isCurrentProduct) {
              buttonText = "Manage";
              onClick = () => authClient.customer.portal();
            } else if (isPremium) {
              buttonText = "Change Plan";
              onClick = () => authClient.customer.portal();
            }

            return (
              <PricingCard
                badge={product.metadata.badge as string | null}
                features={product.benefits.map(
                  (benefit) => benefit.description
                )}
                key={product.id}
                buttonText={buttonText}
                onClick={onClick}
                variant={
                  product.metadata.variant === "highlighted"
                    ? "highlighted"
                    : "default"
                }
                title={product.name}
                price={
                  product.prices[0].amountType === "fixed"
                    ? product.prices[0].priceAmount / 100
                    : 0
                }
                description={product.description}
                priceSuffix={`/${product.prices[0].recurringInterval}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function UpgradeLoading() {
  return (
    <LoadingState title="Loading..." description="Please wait a few seconds" />
  );
}
export function UpgradeError() {
  return (
    <ErrorState title="Error loading..." description="Something went wrong!" />
  );
}
