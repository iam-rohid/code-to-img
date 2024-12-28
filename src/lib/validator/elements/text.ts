import { z } from "zod";

import { backgroundSchema } from "../color";

import { alginmentSchema, elementBase, paddingSchema } from "./shared";

export const textElementSchema = z
  .object({
    type: z.literal("text"),
    content: z.record(z.any()),
    borderRadius: z.number().min(0).default(12),
    background: backgroundSchema.default({
      color: { type: "solid", color: "#FFFFFF" },
    }),
    padding: paddingSchema.default({ bottom: 0, left: 0, right: 0, top: 0 }),
    verticalAlignment: alginmentSchema.default("center"),
  })
  .merge(elementBase);

export type iTextElement = z.infer<typeof textElementSchema>;
