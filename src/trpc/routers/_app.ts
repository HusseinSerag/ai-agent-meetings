import { meetingsRouter } from "@/modules/meetings/server/procedures";
import { createTRPCRouter } from "../init";
import { agentsRouter } from "@/modules/agents/server/procedures";
import { dashboardRouter } from "@/modules/dashboard/server/procedures";
import { premiumRouter } from "@/modules/premium/server/procedures";

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  dashboard: dashboardRouter,
  premium: premiumRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
