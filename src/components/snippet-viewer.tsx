"use client";

import { useMemo } from "react";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror, { EditorView, Extension } from "@uiw/react-codemirror";

import useElementSize from "@/hooks/use-element-size";
import { codeEditorThemes } from "@/lib/constants/code-editor-themes";
import { cn } from "@/lib/utils";
import { getBackgroundStyle, getPaddingStyle } from "@/lib/utils/editor";
import {
  iCodeEditorElement,
  iElement,
  iTextElement,
} from "@/lib/validator/element";
import { iSnippetData } from "@/lib/validator/snippet";

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
  const offset = useMemo(() => {
    if (!element.transform) {
      return {
        x: 0,
        y: 0,
      };
    }
    return {
      x:
        (element.transform.width * element.transform.scale -
          element.transform.width) /
        2,
      y:
        (element.transform.height * element.transform.scale -
          element.transform.height) /
        2,
    };
  }, [element.transform]);

  return (
    <div
      style={{
        display: element.hidden ? "none" : undefined,
        pointerEvents: element.locked ? "none" : "auto",
        left: element.transform.position.x,
        top: element.transform.position.y,
        width: element.transform.autoWidth
          ? "fit-content"
          : element.transform.width,
        height: element.transform.autoHeight
          ? "fit-content"
          : element.transform.height,
        minWidth: 20,
        minHeight: 20,
        transform: `
          translate(${offset.x}px, ${offset.y}px) 
          rotate(${element.transform.rotation}deg) 
          scale(${element.transform.scale})
        `,
      }}
      className="absolute"
    >
      {element.type === "code-editor" ? (
        <CodeEditor element={element} />
      ) : element.type === "text" ? (
        <TextElement element={element} />
      ) : null}
    </div>
  );
}

function TextElement({ element }: { element: iTextElement }) {
  return (
    <div className="h-full w-full">
      <p
        className="h-full w-full overflow-hidden rounded-md leading-none"
        style={{
          textAlign: element.horizontalAlignment,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight,
          fontFamily: element.fontFamily,
          letterSpacing: element.letterSpacing,
          color: element.foregrounnd,
          lineHeight: element.lineHeight,
          ...getPaddingStyle(element.padding),
          ...getBackgroundStyle(element.background.color),
        }}
      >
        {element.text}
      </p>
    </div>
  );
}

function CodeEditor({ element }: { element: iCodeEditorElement }) {
  const theme = useMemo(
    () => codeEditorThemes.find((theme) => theme.id === element.theme),
    [element.theme],
  );

  const extensions = useMemo(() => {
    const extensions: Extension[] = [];
    const lang = loadLanguage(element.language);
    if (lang) {
      extensions.push(lang);
    }
    if (!element.transform.autoWidth) {
      extensions.push(EditorView.lineWrapping);
    }
    return extensions;
  }, [element.language, element.transform.autoWidth]);

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 shadow-xl"
      style={{
        background: theme?.window?.background,
        backgroundImage: theme?.window?.backgroundImage,
        color: theme?.window?.foreground,
        ...theme?.window?.style,
      }}
    >
      <div
        style={{
          background: theme?.window?.titleBarBackground,
          color: theme?.window?.titleBarForeground,
          ...theme?.window?.titleBarStyle,
        }}
        className="flex-shrink-0 overflow-hidden"
      >
        <div>
          <div className="flex h-full items-center gap-2 py-4 pl-4">
            <div
              className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#FEBC2E]"
              style={{
                backgroundColor: theme?.window?.titleBarTraficLightColor1,
              }}
            ></div>
            <div
              className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#FF5F57]"
              style={{
                backgroundColor: theme?.window?.titleBarTraficLightColor2,
              }}
            ></div>
            <div
              className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#28C840]"
              style={{
                backgroundColor: theme?.window?.titleBarTraficLightColor3,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-1 overflow-hidden"
        style={{
          ...theme?.window?.codeMirrorContainerStyle,
          paddingLeft: element.padding.left,
          paddingRight: element.padding.right,
          paddingTop: element.padding.top,
          paddingBottom: element.padding.bottom,
        }}
      >
        <CodeMirror
          value={element.code}
          theme={theme?.theme}
          height={element.transform.autoHeight ? undefined : "100%"}
          width={
            element.transform.autoWidth
              ? undefined
              : `${element.transform.width}px`
          }
          extensions={extensions}
          editable={false}
          aria-disabled
          basicSetup={{
            lineNumbers: element.lineNumbers,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            foldGutter: false,
          }}
          style={{
            fontSize: element.fontSize,
            lineHeight: element.lineHeight,
            ...theme?.window?.codeMirrorStyle,
          }}
        />
      </div>
    </div>
  );
}
