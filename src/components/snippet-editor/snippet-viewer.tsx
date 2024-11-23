"use client";

import { useMemo } from "react";

import useElementSize from "@/hooks/use-element-size";
import { cn } from "@/lib/utils";
import { getBackgroundStyle } from "@/lib/utils/editor";
import { iElement } from "@/lib/validator/element";
import { iSnippetData } from "@/lib/validator/snippet";

import CodeEditorElement from "./elements/code-editor";
import TextElement from "./elements/text-element";
import { getElementWrapperStyle } from "./utils";

export default function SnippetViewer({
  data,
  className,
}: {
  data: iSnippetData;
  className?: string;
}) {
  const { ref, height, width } = useElementSize();

  const scale = useMemo(() => {
    if (width / height < data.transform.width / data.transform.height) {
      return width / data.transform.width;
    }
    return height / data.transform.height;
  }, [data.transform.height, data.transform.width, height, width]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        style={{
          width: data.transform.width,
          height: data.transform.height,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
        className="absolute left-1/2 top-1/2"
      >
        <div
          className="absolute inset-0 z-0"
          style={
            data.background.color
              ? getBackgroundStyle(data.background.color)
              : {}
          }
        ></div>

        <div className="pointer-events-none absolute inset-0 z-10">
          {data.elements.toReversed().map((element) => (
            <Element key={element.id} element={element} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Element({ element }: { element: iElement }) {
  return (
    <div style={getElementWrapperStyle(element)}>
      {element.type === "code-editor" ? (
        <CodeEditorElement element={element} readOnly />
      ) : element.type === "text" ? (
        <TextElement element={element} />
      ) : null}
    </div>
  );
}
