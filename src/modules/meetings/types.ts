import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";
export type MeetingGetSingle =
  inferRouterOutputs<AppRouter>["meetings"]["getOne"];
