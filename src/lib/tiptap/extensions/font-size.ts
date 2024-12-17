import "@tiptap/extension-text-style";

import { Extension } from "@tiptap/core";

export type FontSizeOptions = {
  types: string[];
  defaultFontSize?: number;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (color: number) => ReturnType;

      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        defaultFontSize: this.options.defaultFontSize,
        attributes: {
          fontSize: {
            default: 16,
            parseHTML: (element) => {
              const size = element.style.fontSize?.replace(/['"]+/g, "");
              if (size) {
                return parseFloat(size);
              }
              return 16;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetColor:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
