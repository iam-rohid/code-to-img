"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "zustand";

import { getBackgroundStyle } from "@/lib/utils/editor";

import { ElementMemo } from "./element";
import { useSnippetEditor } from "./snippet-editor";

export default function Canvas() {
  const { snippetStore, readOnly, editorStore } = useSnippetEditor();
  const width = useStore(snippetStore, (state) => state.transform.width);
  const height = useStore(snippetStore, (state) => state.transform.height);
  const background = useStore(snippetStore, (state) => state.background);
  const elements = useStore(snippetStore, (state) => state.elements);
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
  );
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [draggingElementId, setDraggingElementId] = useState<string | null>(
    null,
  );
  const updateElementTransform = useStore(
    snippetStore,
    (state) => state.updateElementTransform,
  );
  const [startMousePos, setStartMousePos] = useState({ x: 0, y: 0 });

  const zoom = useStore(editorStore, (state) => state.zoom);
  const updateElementState = useStore(
    editorStore,
    (state) => state.updateElementState,
  );

  const draggingElement = useMemo(
    () =>
      draggingElementId
        ? elements.find((element) => element.id === draggingElementId)
        : null,
    [draggingElementId, elements],
  );
  const elementIds = useMemo(() => elements.map((el) => el.id), [elements]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const elementId = (e.currentTarget as HTMLDivElement).getAttribute(
        "data-cti-element-id",
      );
      console.log(elementId);
      if (!elementId) {
        return;
      }
      setDraggingElementId(elementId);
      updateElementState(elementId, { dragging: true });
      setStartMousePos({ x: e.clientX, y: e.clientY });
      document.documentElement.classList.add("cursor-move", "select-none");
    },
    [updateElementState],
  );

  const handleMouseUp = useCallback(() => {
    if (!draggingElementId) {
      return;
    }

    updateElementState(draggingElementId, { dragging: false });
    setDraggingElementId(null);
    document.documentElement.classList.remove("cursor-move", "select-none");
  }, [draggingElementId, updateElementState]);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!draggingElement?.id) return;

      let x = draggingElement.transform.position.x;
      let y = draggingElement.transform.position.y;

      const difX = startMousePos.x - e.clientX;
      const difY = startMousePos.y - e.clientY;

      x -= difX / zoom;
      y -= difY / zoom;

      updateElementTransform(draggingElement.id, {
        position: { x: Math.round(x), y: Math.round(y) },
      });
      setStartMousePos({ x: e.clientX, y: e.clientY });
    },
    [
      draggingElement?.id,
      draggingElement?.transform.position.x,
      draggingElement?.transform.position.y,
      startMousePos.x,
      startMousePos.y,
      updateElementTransform,
      zoom,
    ],
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const dragableElementHandles =
      canvasRef.current.getElementsByClassName("cti-drag-handle");

    for (let i = 0; i < dragableElementHandles.length; i++) {
      const el = dragableElementHandles.item(i) as HTMLDivElement | null;
      el?.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      for (let i = 0; i < dragableElementHandles.length; i++) {
        const el = dragableElementHandles.item(i) as HTMLDivElement | null;
        el?.removeEventListener("mousedown", handleMouseDown);
      }
    };
  }, [handleMouseDown, elementIds]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, readOnly]);

  return (
    <div
      style={{ width, height }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      ref={canvasRef}
    >
      <div
        className="absolute inset-0 z-0"
        style={background.color ? getBackgroundStyle(background.color) : {}}
        onClick={() => {
          if (!readOnly) {
            setSelectedElement("canvas");
          }
        }}
      ></div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {elements.toReversed().map((element) => (
          <ElementMemo element={element} key={element.id} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 ring-[9999px] ring-background/80"></div>
    </div>
  );
}
