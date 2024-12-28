import { z } from "zod";

export const solidColorSchema = z.object({
  type: z.literal("solid"),
  color: z.string(),
});
export type iSolidColor = z.infer<typeof solidColorSchema>;

export const gradientColorSchema = z.object({
  type: z.literal("gradient"),
  colors: z.array(z.string()),
  angle: z.number(),
});
export type iGradientColor = z.infer<typeof gradientColorSchema>;

export const colorSchema = z.discriminatedUnion("type", [
  solidColorSchema,
  gradientColorSchema,
]);
export type iColor = z.infer<typeof colorSchema>;

export const backgroundSchema = z.object({
  color: colorSchema.nullable().default(null),
  image: z.string().nullable().default(null),
  imageFill: z.enum(["contain", "cover", "fill"]).default("cover"),
});

export type iBackground = z.infer<typeof backgroundSchema>;
