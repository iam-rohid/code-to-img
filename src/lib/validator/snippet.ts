import { z } from "zod";

import { backgroundSchema } from "./color";
import { elementSchema } from "./element";
import { transformSchema } from "./transform";

export const snippetSchema = z.object({
  transform: transformSchema,
  background: backgroundSchema,
  elements: z.array(elementSchema),
});

export type iSnippetData = z.infer<typeof snippetSchema>;
