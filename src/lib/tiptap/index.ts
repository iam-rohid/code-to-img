import { Editor } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

import { FontSize } from "@/lib/tiptap/extensions/font-size";
import { iTextElement } from "../validator/elements";

export const tiptapExtensions = [
  StarterKit.configure({
    blockquote: false,
    code: false,
    codeBlock: false,
    dropcursor: false,
    gapcursor: false,
    heading: false,
    horizontalRule: false,
  }),
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle,
  Color,
  FontSize.configure({
    defaultFontSize: 16,
  }),
];

export const getEditor = (element: iTextElement) =>
  new Editor({
    extensions: tiptapExtensions,
    content: element.content,
    editable: false,
    injectCSS: false,
    onCreate: ({ editor }) => {
      editor.chain().selectAll().run();
    },
  });
