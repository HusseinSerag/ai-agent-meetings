import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";
export type AgentGetSingle = inferRouterOutputs<AppRouter>["agents"]["getOne"];
