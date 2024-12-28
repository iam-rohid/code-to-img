import { z } from "zod";

export const elementBase = z.object({
  version: z.string(),
  id: z.string(),
  name: z.string(),
  width: z.number(),
  height: z.number(),
  autoWidth: z.boolean().default(false),
  autoHeight: z.boolean().default(false),
  widthHeightLinked: z.boolean().default(false),
  rotation: z.number().default(0),
  scale: z.number().min(0.1).max(5).default(1),
  x: z.number().default(0),
  y: z.number().default(0),
  hidden: z.boolean().default(false),
  locked: z.boolean().default(false),
  boxShadow: z.string().default("none"),
});

export type iElementBase = z.infer<typeof elementBase>;

export const paddingSchema = z.object({
  left: z.number(),
  top: z.number(),
  right: z.number(),
  bottom: z.number(),
  horizontalLinked: z.boolean().default(false),
  verticalLinked: z.boolean().default(false),
});

export type iPadding = z.infer<typeof paddingSchema>;

export const alginmentSchema = z.enum(["start", "center", "end"]);

export type iAlignment = z.infer<typeof alginmentSchema>;
