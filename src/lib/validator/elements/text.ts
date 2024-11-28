import { z } from "zod";

import { backgroundSchema } from "../color";

import { alginmentSchema, elementBase, paddingSchema } from "./shared";

export const textElementSchema = z
  .object({
    type: z.literal("text"),
    text: z.string().optional().default("Text"),
    fontSize: z.number().min(0).optional().default(16),
    lineHeight: z.number().min(0).default(24),
    letterSpacing: z.number().optional().default(1),
    fontFamily: z.string().optional(),
    fontWeight: z.string().optional(),
    foregrounnd: z.string().optional(),
    background: backgroundSchema
      .optional()
      .default({ color: { type: "solid", color: "#FFFFFF" } }),
    padding: paddingSchema
      .optional()
      .default({ bottom: 0, left: 0, right: 0, top: 0 }),
    horizontalAlignment: alginmentSchema.optional().default("center"),
    verticalAlignment: alginmentSchema.optional().default("center"),
  })
  .merge(elementBase);

export type iTextElement = z.infer<typeof textElementSchema>;