/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";

import useElementSize from "@/hooks/use-element-size";
import { getEditor } from "@/lib/tiptap";
import { cn } from "@/lib/utils";
import { getBackgroundStyle } from "@/lib/utils/editor";
import { iElement } from "@/lib/validator/elements";
import { iSnippetData } from "@/lib/validator/snippet";
import { ContextMenu } from "../ui/context-menu";

import CodeEditorElement from "./elements/code-editor";
import ImageElement from "./elements/image";
import TextElement from "./elements/text-element";
import { getElementWrapperStyle } from "./utils";

export default function SnippetViewer({
  data,
  className,
  snippetElementId,
}: {
  data: iSnippetData;
  className?: string;
  snippetElementId?: string;
}) {
  const { ref, height, width } = useElementSize();

  const scale = useMemo(() => {
    if (width / height < data.width / data.height) {
      return width / data.width;
    }
    return height / data.height;
  }, [data.height, data.width, height, width]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
        className="overflow-hidden"
      >
        <div
          style={{
            width: data.width,
            height: data.height,
          }}
          id={snippetElementId}
          className="overflow-hidden"
        >
          <div
            className="absolute inset-0 z-0 overflow-hidden"
            style={
              data.background.color
                ? getBackgroundStyle(data.background.color)
                : {}
            }
          >
            {data.background.image && (
              <img
                src={data.background.image}
                alt="Background Image"
                className="absolute inset-0 h-full w-full"
                style={{
                  objectFit: data.background.imageFill ?? "cover",
                }}
              />
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 z-10">
            {data.elements.toReversed().map((element) => (
              <Element key={element.id} element={element} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Element({ element }: { element: iElement }) {
  return (
    <ContextMenu>
      <div style={getElementWrapperStyle(element)}>
        {element.type === "code-editor" ? (
          <CodeEditorElement element={element} readOnly />
        ) : element.type === "text" ? (
          <TextElement element={element} readOnly editor={getEditor(element)} />
        ) : element.type === "image" ? (
          <ImageElement element={element} readOnly />
        ) : null}
      </div>
    </ContextMenu>
  );
}
