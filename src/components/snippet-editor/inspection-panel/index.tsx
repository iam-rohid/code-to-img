import { memo } from "react";
import { useStore } from "zustand";

import { useEditor } from "../editor";

import { CanvasInspectorMemo } from "./canvas-inspector";
import { ElementInspectorMemo } from "./element-inspector";

export default function InspectionPanel() {
  const { editorStore } = useEditor();
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
