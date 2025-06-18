import { db } from "@/db";
import { agents } from "@/db/schema";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
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
