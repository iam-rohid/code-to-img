import { highlight, languages } from "prismjs";
import { iElement } from "../types";
import Draggable from "./draggable";
import { useState } from "react";
import Editor from "react-simple-code-editor";

export default function CodeEditorElement({ element }: { element: iElement }) {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);

  if (element.type !== "code-editor") {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-600 bg-slate-700 text-slate-200 shadow-xl">
      <Draggable element={element} className="h-11 flex-shrink-0 bg-slate-600">
        <div className="flex h-full items-center gap-2 pl-4">
          <div className="h-3.5 w-3.5 rounded-full bg-[#FF5F57]"></div>
          <div className="h-3.5 w-3.5 rounded-full bg-[#FEBC2E]"></div>
          <div className="h-3.5 w-3.5 rounded-full bg-[#28C840]"></div>
        </div>
      </Draggable>
      <div className="flex-1 overflow-hidden">
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) => highlight(code, languages.js, "js")}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
}
