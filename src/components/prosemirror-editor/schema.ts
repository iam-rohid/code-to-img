import { DOMOutputSpec, MarkSpec, Schema } from "prosemirror-model";
import { marks, schema as basicSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";

const underlineDOM: DOMOutputSpec = ["u", 0];

export const schema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block"),
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
