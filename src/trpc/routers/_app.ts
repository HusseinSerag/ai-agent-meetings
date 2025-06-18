import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { agentsRouter } from "@/modules/agents/server/procedures";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
