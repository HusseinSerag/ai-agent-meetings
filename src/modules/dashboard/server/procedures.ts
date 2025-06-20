import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, ilike, sql, getTableColumns } from "drizzle-orm";
import { z } from "zod";

export const dashboardRouter = createTRPCRouter({
  getData: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search } = input;
      const [agentsData, meetingsData] = await Promise.all([
        db
          .select({
            id: agents.id,
            name: agents.name,
            createdAt: agents.createdAt,
            type: sql<"Agent">`'Agent'`.as("type"),
          })
          .from(agents)
          .where(
            and(
              eq(agents.userId, ctx.auth.user.id),
              search ? ilike(agents.name, `%${search}%`) : undefined
            )
          )
          .limit(100)
          .orderBy(desc(agents.createdAt), desc(agents.id)),
        db
          .select({
            status: meetings.status,
            id: meetings.id,
            name: meetings.name,
            createdAt: meetings.createdAt,
            type: sql<"Meeting">`'Meeting'`.as("type"),
          })
          .from(meetings)
          .where(
            and(
              eq(meetings.userId, ctx.auth.user.id),
              search ? ilike(meetings.name, `%${search}%`) : undefined
            )
          )
          .limit(100)
          .orderBy(desc(meetings.createdAt), desc(meetings.id)),
      ]);
      const data = [...meetingsData, ...agentsData].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      return {
        data: data,
      };
    }),
});
