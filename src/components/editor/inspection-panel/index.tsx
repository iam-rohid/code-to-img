import { memo } from "react";

import { useEditorStore } from "@/store/editor-store";

import { CanvasInspectorMemo } from "./canvas-inspector";
import { ElementInspectorMemo } from "./element-inspector";

export default function InspectionPanel() {
  const selectedElementId = useEditorStore((state) => state.selectedElementId);

  if (!selectedElementId) {
    return null;
  }

  if (selectedElementId === "canvas") {
    return <CanvasInspectorMemo />;
  }

  return <ElementInspectorMemo elementId={selectedElementId} />;
}

export const InspectionPanelMemo = memo(InspectionPanel);
