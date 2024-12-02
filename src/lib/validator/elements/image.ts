import { z } from "zod";

import { elementBase } from "./shared";

export const imageElementSchema = z
  .object({
    type: z.literal("image"),
    src: z.string(),
    alt: z.string().optional(),
    objectFit: z.enum(["fill", "contain", "cover"]),
  })
  .merge(elementBase);

export type iImageElement = z.infer<typeof imageElementSchema>;
