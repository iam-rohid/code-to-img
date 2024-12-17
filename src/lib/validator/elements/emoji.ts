import { z } from "zod";

import { elementBase } from "./shared";

export const emojiElementSchema = z
  .object({
    type: z.literal("emoji"),
    emoji: z.string().emoji(),
  })
  .merge(elementBase);

export type iEmojiElement = z.infer<typeof emojiElementSchema>;
