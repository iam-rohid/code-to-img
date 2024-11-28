import { z } from "zod";

import { DEFAULT_THEME } from "@/lib/constants/code-editor-themes";
import { languageSchema } from "../language";

import { elementBase, paddingSchema } from "./shared";

export const codeEditorTabSchema = z.object({
  id: z.string(),
  code: z.string().optional().default("// Enter your code here"),
  name: z.string().optional(),
  language: languageSchema.optional().default("javascript"),
});

export type CodeEditorTab = z.infer<typeof codeEditorTabSchema>;

export const codeEditorElementSchema = z
  .object({
    type: z.literal("code-editor"),
    fontSize: z.number().min(0).optional().default(16),
    lineHeight: z.number().min(0).optional().default(24),
    showLineNumbers: z.boolean().optional().default(true),
    lineNumbersStartFrom: z.number().min(1).optional().default(1),
    tabSize: z.number().min(2).optional().default(4),
    theme: z.string().optional().default(DEFAULT_THEME),
    padding: paddingSchema
      .optional()
      .default({ bottom: 12, left: 12, right: 12, top: 0 }),
    showTitleBar: z.boolean().optional().default(true),
    titleBarControlPosition: z
      .enum(["left", "right"])
      .optional()
      .default("left"),
    titleBarControlStyle: z.string().optional().default("macos-default"),
    showTabs: z.boolean().optional().default(true),
    tabs: z.array(codeEditorTabSchema).min(1),
    border: z.boolean().optional().default(true),
  })
  .merge(elementBase);

export type iCodeEditorElement = z.infer<typeof codeEditorElementSchema>;
