import { useEffect, useMemo, useRef, useState } from "react";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror, {
  EditorView,
  Extension,
  lineNumbers,
} from "@uiw/react-codemirror";

import { codeEditorThemes } from "@/lib/constants/code-editor-themes";
import { cn } from "@/lib/utils";
import { iCodeEditorElement } from "@/lib/validator/element";

import { TITLE_BAR_CONTROLS } from "./controls";

export default function CodeEditorElement({
  element,
  readOnly,
  onCodeChange,
}: {
  element: iCodeEditorElement;
  readOnly?: boolean;
  onCodeChange?: (code: string) => void;
}) {
  const [code, setCode] = useState(element.code);
  const theme = useMemo(
    () => codeEditorThemes.find((theme) => theme.id === element.theme),
    [element.theme],
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const extensions = useMemo(() => {
    const extensions: Extension[] = [];
    const lang = loadLanguage(element.language);
    if (lang) {
      extensions.push(lang);
    }
    if (!element.transform.autoWidth) {
      extensions.push(EditorView.lineWrapping);
    }
    if (element.showLineNumbers) {
      extensions.push(
        lineNumbers({
          formatNumber: (n) => {
            return (n + element.lineNumbersStartFrom - 1).toString();
          },
        }),
      );
    }
    return extensions;
  }, [
    element.language,
    element.lineNumbersStartFrom,
    element.showLineNumbers,
    element.transform.autoWidth,
  ]);

  const Control = useMemo(
    () =>
      TITLE_BAR_CONTROLS.find(
        (control) => control.id === element.titleBarControlStyle,
      )?.Control,
    [element.titleBarControlStyle],
  );

  useEffect(() => {
    setCode(element.code);
  }, [element.code]);

  return (
    <div
      id={element.id}
      className="flex h-full w-full flex-col overflow-hidden"
      style={{
        background: theme?.window?.background,
        backgroundImage: theme?.window?.backgroundImage,
        color: theme?.window?.foreground,
        ...theme?.window?.style,
      }}
    >
      {element.showTitleBar ? (
        <div
          style={{
            background: theme?.window?.titleBarBackground,
            color: theme?.window?.titleBarForeground,
            ...theme?.window?.titleBarStyle,
          }}
          data-cti-element-id={element.id}
          className="cti-drag-handle flex-shrink-0 overflow-hidden"
        >
          <div
            className={cn("flex h-12 items-center gap-4 px-4", {
              "flex-row-reverse": element.titleBarControlPosition === "right",
            })}
          >
            {Control ? <Control /> : null}
            <div className="flex-1">
              {/* <p className="text-white">Hello</p> */}
            </div>
          </div>
        </div>
      ) : (
        <div
          data-cti-element-id={element.id}
          className="cti-drag-handle absolute left-0 right-0 top-0 z-10 h-4"
        />
      )}

      <CodeMirror
        value={code}
        theme={theme?.theme}
        height={element.transform.autoHeight ? undefined : "100%"}
        width={element.transform.autoWidth ? undefined : `100%`}
        extensions={extensions}
        onChange={(value) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setCode(value);
          timeoutRef.current = setTimeout(() => {
            onCodeChange?.(value);
          }, 200);
        }}
        readOnly={readOnly}
        basicSetup={{
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          foldGutter: false,
          indentOnInput: true,
          lineNumbers: false,
          tabSize: element.tabSize,
        }}
        style={{
          maxWidth: "100%",
          flex: 1,
          overflow: "hidden",
          fontSize: element.fontSize,
          lineHeight: element.lineHeight,
          paddingLeft: element.padding.left,
          paddingRight: element.padding.right,
          paddingTop: element.padding.top,
          paddingBottom: element.padding.bottom,
          ...theme?.window?.codeMirrorStyle,
        }}
      />
    </div>
  );
}
