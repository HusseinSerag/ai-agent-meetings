"use client";

import { ErrorState } from "@/components/Error";
import { LoadingState } from "@/components/Loading";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function AgentsView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div>
      {data.map((agent) => (
        <div>{agent.name}</div>
      ))}
    </div>
  );
}

export function AgentsLoading() {
  return (
    <LoadingState
      title="Loading Agents"
      description="Please wait a few seconds"
    />
  );
}
export function AgentsError() {
  return (
    <ErrorState
      title="Error loading agents"
      description="Something went wrong!"
    />
  );
}
