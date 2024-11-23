import { useMemo } from "react";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror, { EditorView, Extension } from "@uiw/react-codemirror";

import { codeEditorThemes } from "@/lib/constants/code-editor-themes";
import { cn } from "@/lib/utils";
import { iCodeEditorElement } from "@/lib/validator/element";

function MacOSControl() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#FF5F57]" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#FEBC2E]" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-[#28C840]" />
    </div>
  );
}
function MacOSMutedControl() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-gray-500/50" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-gray-500/50" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full bg-gray-500/50" />
    </div>
  );
}
function MacOSOutlinedControl() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-[#FF5F57]" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-[#FEBC2E]" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-[#28C840]" />
    </div>
  );
}
function MacOSOutlinedMutedControl() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-gray-500/50" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-gray-500/50" />
      <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-gray-500/50" />
    </div>
  );
}
function WindowsControl() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-3.5 w-3.5">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-gray-500/50"></div>
      </div>
      <div className="relative h-3.5 w-3.5 border-2 border-gray-500/50" />
      <div className="relative h-3.5 w-3.5">
        <div className="absolute left-1/2 top-1/2 h-[2px] w-[calc(100%+6px)] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-500/50"></div>
        <div className="absolute left-1/2 top-1/2 h-[2px] w-[calc(100%+6px)] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-gray-500/50"></div>
      </div>
    </div>
  );
}

export const controls = [
  {
    id: "macos-default",
    Control: MacOSControl,
  },
  {
    id: "macos-muted",
    Control: MacOSMutedControl,
  },
  {
    id: "macos-outlined",
    Control: MacOSOutlinedControl,
  },
  {
    id: "macos-outlined-muted",
    Control: MacOSOutlinedMutedControl,
  },
  {
    id: "windows",
    Control: WindowsControl,
  },
  {
    id: "no-control",
    Control: null,
  },
];

export default function CodeEditorElement({
  element,
  readOnly,
  onCodeChange,
}: {
  element: iCodeEditorElement;
  readOnly?: boolean;
  onCodeChange?: (code: string) => void;
}) {
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

  const Control = useMemo(
    () =>
      controls.find((control) => control.id === element.titleBarControlStyle)
        ?.Control,
    [element.titleBarControlStyle],
  );

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
            <p className="text-white">Hello</p>
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
          onChange={(value) => {
            onCodeChange?.(value);
          }}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers: element.showLineNumbers,
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
