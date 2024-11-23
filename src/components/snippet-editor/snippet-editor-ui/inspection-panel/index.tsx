import { memo } from "react";
import { useStore } from "zustand";

import { useSnippetEditor } from "../../snippet-editor";

import { CanvasInspectorMemo } from "./canvas-inspector";
import { ElementInspectorMemo } from "./element-inspector";

export default function InspectionPanel() {
  const { editorStore } = useSnippetEditor();
  const selectedElementId = useStore(
    editorStore,
    (state) => state.selectedElementId,
  );

  if (!selectedElementId) {
    return null;
  }

  if (selectedElementId === "canvas") {
    return <CanvasInspectorMemo />;
  }

  return <ElementInspectorMemo elementId={selectedElementId} />;
}

export const InspectionPanelMemo = memo(InspectionPanel);
