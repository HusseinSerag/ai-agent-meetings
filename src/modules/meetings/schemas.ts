import { z } from "zod";

export const meetingsInsertSchema = z.object({
  name: z.string().min(1, { message: "name is required!" }),
  agentId: z.string().min(1, { message: "Agent are required!" }),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().min(1, "id is required"),
  status: z
    .enum(["cancelled", "completed", "active", "processing", "upcoming"])
    .optional(),
});
