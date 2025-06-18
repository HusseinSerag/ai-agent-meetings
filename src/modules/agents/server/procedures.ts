import { db } from "@/db";
import { agents } from "@/db/schema";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [agent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id));
      return agent;
    }),
  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);
    return data;
  }),
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { instructions, name } = input;
      const {
        auth: {
          user: { id },
        },
      } = ctx;
      const [createdAgent] = await db
        .insert(agents)
        .values({
          instructions,
          name,
          userId: id,
        })
        .returning();
      return {
        agentId: createdAgent.id,
      };
    }),
});
