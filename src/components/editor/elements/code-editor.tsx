import { iElement } from "@/store/editor-store";

export default function CodeEditorElement({ element }: { element: iElement }) {
  if (element.type !== "code-editor") {
    return null;
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-700 text-slate-200">
      <p>Code Editor</p>
    </div>
  );
}
