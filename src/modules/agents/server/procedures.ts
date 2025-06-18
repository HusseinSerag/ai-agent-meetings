import { db } from "@/db";
import { agents } from "@/db/schema";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { z } from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [agent] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`,
        })
        .from(agents)
        .where(eq(agents.id, input.id));
      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found!",
        });
      }
      return agent;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const data = await db
      .select({
        ...getTableColumns(agents),
        meetingCount: sql<number>`5`,
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));
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
