import { z } from "zod";

import { codeEditorElementSchema } from "./code-editor";
import { textElementSchema } from "./text";

export const elementSchema = z.discriminatedUnion("type", [
  codeEditorElementSchema,
  textElementSchema,
]);

export type iElement = z.infer<typeof elementSchema>;

export * from "./shared";
export * from "./code-editor";
export * from "./text";
