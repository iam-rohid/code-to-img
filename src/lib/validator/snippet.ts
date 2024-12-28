import { z } from "zod";

import { backgroundSchema } from "./color";
import { elementSchema } from "./elements";

export const snippetSchema = z.object({
  version: z.string(),
  width: z.number().min(0),
  height: z.number().min(0),
  widthHeightLinked: z.boolean().default(false),
  background: backgroundSchema.default({
    color: { type: "solid", color: "#FFFFFF" },
  }),
  elements: z.array(elementSchema).default([]),
});

export type iSnippetData = z.infer<typeof snippetSchema>;
