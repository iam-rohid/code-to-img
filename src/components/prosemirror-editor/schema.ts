import { DOMOutputSpec, MarkSpec, NodeSpec, Schema } from "prosemirror-model";
import { marks } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";

const underlineDOM: DOMOutputSpec = ["u", 0];

const baseNodes: Record<string, NodeSpec> = {
  doc: {
    content: "block+",
  },
  paragraph: {
    content: "inline*",
    group: "block",
    attrs: {
      textAlign: { default: "left" }, // Add text alignment attribute
    },
    parseDOM: [
      {
        tag: "p",
        getAttrs: (dom) => ({
          textAlign: dom.style.textAlign || "left",
        }),
      },
    ],
    toDOM: (node) => [
      "p",
      { style: `text-align: ${node.attrs.textAlign};` },
      0,
    ],
  },
  text: {
    group: "inline",
  },
};

const baseNodesMap = new Schema({ nodes: baseNodes });

export const schema = new Schema({
  nodes: addListNodes(baseNodesMap.spec.nodes, "paragraph block*", "block"),
  marks: {
    ...marks,
    u: {
      parseDOM: [
        { tag: "u" },
        { style: "text-decoration=underline" },
        {
          style: "text-decoration=none",
          clearMark: (m) => m.type.name == "u",
        },
      ],
      toDOM() {
        return underlineDOM;
      },
    } as MarkSpec,
  },
});
