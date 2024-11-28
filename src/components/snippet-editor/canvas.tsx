"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { getBackgroundStyle } from "@/lib/utils/editor";

import Element from "./element";
import { useSnippetEditor } from "./snippet-editor";

export default function Canvas() {
  const { snippetStore, readOnly, editorStore } = useSnippetEditor();
  const width = useStore(snippetStore, (state) => state.width);
  const height = useStore(snippetStore, (state) => state.height);
  const background = useStore(snippetStore, (state) => state.background);
  const elementIds = useStore(
    snippetStore,
    useShallow((state) => state.elements.map((el) => el.id).toReversed()),
  );
  const setSelectedElement = useStore(
    editorStore,
    (state) => state.setSelectedElement,
  );
  const updateElement = useStore(snippetStore, (state) => state.updateElement);
  const zoom = useStore(editorStore, (state) => state.zoom);

  const [draggingElementId, setDraggingElementId] = useState<string | null>(
    null,
  );
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startElementPos = useRef({ x: 0, y: 0 });
  const updateElementState = useStore(
    editorStore,
    (state) => state.updateElementState,
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) {
        return;
      }
      const elementId = (e.currentTarget as HTMLDivElement).getAttribute(
        "data-cti-element-id",
      );
      if (!elementId) {
        return;
      }
      const el = snippetStore
        .getState()
        .elements.find((element) => element.id === elementId);
      if (!el) {
        return;
      }
      setDraggingElementId(el.id);
      updateElementState(el.id, { dragging: true });
      startMousePos.current = { x: e.clientX, y: e.clientY };
      startElementPos.current = { x: el.x, y: el.y };
      document.documentElement.classList.add("cursor-move", "select-none");
    },
    [snippetStore, updateElementState],
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
      if (!draggingElementId) return;

      let x = startElementPos.current.x;
      let y = startElementPos.current.y;

      const difX = startMousePos.current.x - e.clientX;
      const difY = startMousePos.current.y - e.clientY;

      x -= difX / zoom;
      y -= difY / zoom;

      const newPos = { x: Math.round(x), y: Math.round(y) };
      updateElement(draggingElementId, newPos);
      startElementPos.current = newPos;
      startMousePos.current = { x: e.clientX, y: e.clientY };
    },
    [draggingElementId, updateElement, zoom],
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    if (draggingElementId) {
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
  }, [draggingElementId, handleMouseDown, elementIds]);

  useEffect(() => {
    if (!draggingElementId) {
      return;
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingElementId, handleMouseMove, handleMouseUp, readOnly]);

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
        {elementIds.map((elementId) => (
          <Element elementId={elementId} key={elementId} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 ring-[9999px] ring-background/80"></div>
    </div>
  );
}
