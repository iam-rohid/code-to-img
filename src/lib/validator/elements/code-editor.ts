import { z } from "zod";

import { DEFAULT_THEME } from "@/lib/constants/code-editor-themes";
import { languageSchema } from "../language";

import { elementBase, paddingSchema } from "./shared";

export const codeEditorTabSchema = z.object({
  id: z.string(),
  code: z.string().default("// Enter your code here"),
  name: z.string().default("Untitled"),
  language: languageSchema.default("javascript"),
});

export type CodeEditorTab = z.infer<typeof codeEditorTabSchema>;

export const codeEditorElementSchema = z
  .object({
    type: z.literal("code-editor"),
    fontSize: z.number().min(0).default(16),
    lineHeight: z.number().min(0).default(24),
    showLineNumbers: z.boolean().default(true),
    lineNumbersStartFrom: z.number().min(1).default(1),
    tabSize: z.number().min(2).default(4),
    theme: z.string().default(DEFAULT_THEME),
    padding: paddingSchema.default({ bottom: 12, left: 12, right: 12, top: 0 }),
    showTitleBar: z.boolean().default(true),
    titleBarControlPosition: z.enum(["left", "right"]).default("left"),
    titleBarControlStyle: z.string().default("macos-default"),
    showTabs: z.boolean().default(true),
    tabs: z.array(codeEditorTabSchema).min(1),
    border: z.boolean().default(true),
    borderRadius: z.number().min(0).default(10),
  })
  .merge(elementBase);

export type iCodeEditorElement = z.infer<typeof codeEditorElementSchema>;
