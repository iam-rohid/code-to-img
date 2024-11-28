import { z } from "zod";

export const elementBase = z.object({
  version: z.string(),
  id: z.string(),
  name: z.string(),
  width: z.number(),
  height: z.number(),
  autoWidth: z.boolean().optional().default(false),
  autoHeight: z.boolean().optional().default(false),
  widthHeightLinked: z.boolean().optional().default(false),
  rotation: z.number().optional().default(0),
  scale: z.number().min(0.1).max(5).optional().default(1),
  x: z.number().optional().default(0),
  y: z.number().optional().default(0),
  hidden: z.boolean().optional().default(false),
  locked: z.boolean().optional().default(false),
});

export type iElementBase = z.infer<typeof elementBase>;

export const paddingSchema = z.object({
  left: z.number(),
  top: z.number(),
  right: z.number(),
  bottom: z.number(),
  horizontalLinked: z.boolean().optional(),
  verticalLinked: z.boolean().optional(),
});

export type iPadding = z.infer<typeof paddingSchema>;

export const alginmentSchema = z.enum(["start", "center", "end"]);

export type iAlignment = z.infer<typeof alginmentSchema>;
