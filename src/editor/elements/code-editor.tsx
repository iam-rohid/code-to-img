import { useEditorStore } from "../store";

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
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-700 text-slate-200">
      <p>Code Editor</p>
    </div>
  );
}
