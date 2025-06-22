import { db } from "@/db";
import { agents, meetings } from "@/db/schema";

import { polarClientInstance } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { count, eq } from "drizzle-orm";

export const premiumRouter = createTRPCRouter({
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarClientInstance.customers.getStateExternal({
      externalId: ctx.auth.session.userId,
    });
    const subscriptions = customer.activeSubscriptions[0];
    if (!subscriptions) {
      return null;
    }
    const product = await polarClientInstance.products.get({
      id: subscriptions.productId,
    });
    return product;
  }),
  getProducts: protectedProcedure.query(async () => {
    const products = await polarClientInstance.products.list({
      isArchived: false,
      isRecurring: true,
      sorting: ["price_amount"],
    });

    return products.result.items;
  }),
  getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarClientInstance.customers.getStateExternal({
      externalId: ctx.auth.session.userId,
    });

    const subscriptions = customer.activeSubscriptions[0];
    if (subscriptions) {
      return null;
    }
    const [userMeetings] = await db
      .select({
        count: count(meetings.id),
      })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));
    const [userAgents] = await db
      .select({
        count: count(agents.id),
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    return {
      meetingCount: userMeetings.count,
      agentCount: userAgents.count,
    };
  }),
});
