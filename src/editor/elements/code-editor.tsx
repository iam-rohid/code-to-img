import { useEditorStore } from "../store";
import Draggable from "./draggable";

export default function CodeEditorElement({
  elementId,
}: {
  elementId: string;
}) {
  const element = useEditorStore((state) =>
    state.canvas.elements.find((element) => element.id === elementId),
  );
  if (element?.type !== "code-editor") {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-600 bg-slate-700 text-slate-200 shadow-xl">
      <Draggable element={element} className="h-10 bg-slate-600">
        <p>Drag me</p>
      </Draggable>
      <div className="flex-1 p-4">
        <pre className="whitespace-pre-wrap">{`console.log("Hello, World")`}</pre>
      </div>
    </div>
  );
}
