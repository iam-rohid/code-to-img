import { z } from "zod";

export const paddingSchema = z.object({
  left: z.number(),
  top: z.number(),
  right: z.number(),
  bottom: z.number(),
  horizontalLinked: z.boolean().optional(),
  verticalLinked: z.boolean().optional(),
});

export type iPadding = z.infer<typeof paddingSchema>;
