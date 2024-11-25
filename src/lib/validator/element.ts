import { z } from "zod";

import { backgroundSchema } from "./color";
import { languageSchema } from "./language";
import { paddingSchema } from "./padding";
import { alginmentSchema, transformSchema } from "./transform";

const elementBase = z.object({
  id: z.string(),
  name: z.string(),
  transform: transformSchema,
  hidden: z.boolean().optional(),
  locked: z.boolean().optional(),
});

export const codeEditorTabSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  language: languageSchema,
});

export type CodeEditorTab = z.infer<typeof codeEditorTabSchema>;

export const codeEditorElementSchema = z
  .object({
    type: z.literal("code-editor"),
    // code: z.string(),
    fontSize: z.number().min(0),
    lineHeight: z.number().min(0),
    showLineNumbers: z.boolean().default(true),
    lineNumbersStartFrom: z.number().min(1).default(1),
    tabSize: z.number().min(2).default(4),
    theme: z.string(),
    padding: paddingSchema,
    showTitleBar: z.boolean().default(true),
    titleBarControlPosition: z.enum(["left", "right"]).default("left"),
    titleBarControlStyle: z.string().default("macos-default"),
    showTabs: z.boolean().default(true),
    tabs: z.array(codeEditorTabSchema).min(1),
  })
  .merge(elementBase);

export type iCodeEditorElement = z.infer<typeof codeEditorElementSchema>;

export const textElementSchema = z
  .object({
    type: z.literal("text"),
    text: z.string(),
    fontSize: z.number().min(0),
    lineHeight: z.number().min(0),
    letterSpacing: z.number(),
    fontFamily: z.string(),
    fontWeight: z.string(),
    foregrounnd: z.string(),
    background: backgroundSchema,
    padding: paddingSchema,
    horizontalAlignment: alginmentSchema,
    verticalAlignment: alginmentSchema,
  })
  .merge(elementBase);

export type iTextElement = z.infer<typeof textElementSchema>;

export const elementSchema = z.discriminatedUnion("type", [
  codeEditorElementSchema,
  textElementSchema,
]);

export type iElement = z.infer<typeof elementSchema>;
