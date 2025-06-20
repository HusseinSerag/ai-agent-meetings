import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";

export async function getTotalAgentOfUser(id: string) {
  return db
    .select({
      count: count(),
    })
    .from(agents)
    .where(eq(agents.userId, id));
}
export async function getAgentCount(id: string, searchQuery?: string | null) {
  return db
    .select({
      count: count(),
    })
    .from(agents)
    .where(
      and(
        eq(agents.userId, id),
        searchQuery ? ilike(agents.name, `%${searchQuery}%`) : undefined
      )
    );
}
export const agentsRouter = createTRPCRouter({
  update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedAgent] = await db
        .update(agents)
        .set({
          instructions: input.instructions,
          name: input.name,
        })

        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
        )
        .returning();
      if (!updatedAgent) {
        throw new TRPCError({
          message: "Agent Not found!",
          code: "NOT_FOUND",
        });
      }
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [removedAgent] = await db
        .delete(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
        )
        .returning();
      if (!removedAgent) {
        throw new TRPCError({
          message: "Agent Not found!",
          code: "NOT_FOUND",
        });
      }
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const [agent] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`COUNT(${meetings.id})`.as("meeting_count"),
        })
        .from(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
        )
        .leftJoin(meetings, eq(agents.id, meetings.agentId))
        .groupBy(agents.id);
      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found!",
        });
      }
      return agent;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const [data, total, totalAgents] = await Promise.all([
        db
          .select({
            ...getTableColumns(agents),
            meetingCount: sql<number>`COUNT(${meetings.id})`.as(
              "meeting_count"
            ),
          })
          .from(agents)
          .where(
            and(
              eq(agents.userId, ctx.auth.user.id),
              search ? ilike(agents.name, `%${search}%`) : undefined
            )
          )
          .leftJoin(meetings, eq(agents.id, meetings.agentId))
          .groupBy(agents.id)
          .orderBy(desc(agents.createdAt), desc(agents.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        getAgentCount(ctx.auth.user.id, search),
        db.select().from(agents).where(eq(agents.userId, ctx.auth.user.id)),
      ]);

      const totalPages = Math.ceil(total[0].count / pageSize);
      return {
        items: data,
        total: total[0].count,
        totalPages,
        hasAgents: totalAgents.length > 0,
      };
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
