import { z } from "zod";

export const transformSchema = z.object({
  width: z.number(),
  height: z.number(),
  autoWidth: z.boolean().optional(),
  autoHeight: z.boolean().optional(),
  widthHeightLinked: z.boolean().optional(),
  rotation: z.number(),
  scale: z.number().min(0.1).max(3),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export type iTransform = z.infer<typeof transformSchema>;

export const alginmentSchema = z.enum(["start", "center", "end"]);

export type iAlignment = z.infer<typeof alginmentSchema>;
