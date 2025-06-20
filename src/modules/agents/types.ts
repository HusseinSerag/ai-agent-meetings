import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";
export type AgentGetSingle = inferRouterOutputs<AppRouter>["agents"]["getOne"];
export type AgentGetMany =
  inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"];
