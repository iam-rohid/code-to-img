import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as TabsPremitives from "@radix-ui/react-tabs";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror, {
  EditorView,
  Extension,
  lineNumbers,
} from "@uiw/react-codemirror";
import { PlusIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";

import {
  codeEditorThemes,
  iCodeEditorTheme,
} from "@/lib/constants/code-editor-themes";
import { cn } from "@/lib/utils";
import { CodeEditorTab, iCodeEditorElement } from "@/lib/validator/element";

import { TITLE_BAR_CONTROLS } from "./controls";

const MAX_TABS = 3;

export default function CodeEditorElement({
  element,
  readOnly,
  onChange,
  onTabSelect,
}: {
  element: iCodeEditorElement;
  readOnly?: boolean;
  onChange?: (element: iCodeEditorElement) => void;
  onTabSelect?: (tabId: string) => void;
}) {
  const [selectedTabId, setSelectedTabId] = useState(() => element.tabs[0].id);
  const theme = useMemo(
    () => codeEditorThemes.find((theme) => theme.id === element.theme),
    [element.theme],
  );

  const extensions = useMemo(() => {
    const extensions: Extension[] = [];
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

  const handleAddNewTab = useCallback(() => {
    if (element.tabs.length >= MAX_TABS) {
      return;
    }
    const newTab: CodeEditorTab = {
      id: nanoid(),
      code: "",
      language: "javascript",
      name: "",
    };
    onChange?.({
      ...element,
      tabs: [...element.tabs, newTab],
    });
    setSelectedTabId(newTab.id);
  }, [element, onChange]);

  const handleRemoveTab = useCallback(
    (tabId: string) => {
      const newTabsList = element.tabs.filter((tab) => tab.id !== tabId);
      if (newTabsList.length === 0) {
        return;
      }

      onChange?.({
        ...element,
        tabs: newTabsList,
      });
      if (tabId === selectedTabId) {
        setSelectedTabId(newTabsList[0].id);
      }
    },
    [element, onChange, selectedTabId],
  );

  useEffect(() => {
    onTabSelect?.(selectedTabId);
  }, [onTabSelect, selectedTabId]);

  return (
    <TabsPremitives.Root
      value={selectedTabId}
      onValueChange={setSelectedTabId}
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
              <TabsPremitives.List className="flex flex-nowrap items-center gap-1">
                {element.tabs.map((tab) => (
                  <div key={tab.id} className="relative">
                    <TabsPremitives.Trigger
                      value={tab.id}
                      className={cn(
                        "h-8 max-w-48 rounded-md px-3 text-left text-sm font-medium aria-selected:bg-accent aria-selected:text-accent-foreground",
                        {
                          "pr-8": !readOnly,
                        },
                      )}
                    >
                      <p className="truncate">{tab.name || "Untitled"}</p>
                    </TabsPremitives.Trigger>
                    {!readOnly && element.tabs.length > 0 && (
                      <button
                        className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full hover:bg-secondary"
                        onClick={() => handleRemoveTab(tab.id)}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                {!readOnly && element.tabs.length < MAX_TABS && (
                  <button
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-secondary"
                    onClick={handleAddNewTab}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                )}
              </TabsPremitives.List>
            </div>
          </div>
        </div>
      ) : (
        <div
          data-cti-element-id={element.id}
          className="cti-drag-handle absolute left-0 right-0 top-0 z-10 h-4"
        />
      )}

      {element.tabs.map((tab) => (
        <TabsPremitives.Content
          key={tab.id}
          value={tab.id}
          className="overflow-hidden"
        >
          <TabContent
            key={tab.id}
            tab={tab}
            extensions={extensions}
            theme={theme}
            element={element}
            onCodeChange={(code) =>
              onChange?.({
                ...element,
                tabs: element.tabs.map((oldTab) =>
                  oldTab.id === tab.id ? { ...oldTab, code } : oldTab,
                ),
              })
            }
            readOnly={readOnly}
          />
        </TabsPremitives.Content>
      ))}
    </TabsPremitives.Root>
  );
}

function TabContent({
  tab,
  extensions: pExtensions = [],
  element,
  theme,
  onCodeChange,
  readOnly,
}: {
  tab: CodeEditorTab;
  extensions?: Extension[];
  theme?: iCodeEditorTheme;
  onCodeChange?: (value: string) => void;
  readOnly?: boolean;
  element: iCodeEditorElement;
}) {
  const [code, setCode] = useState(tab.code);
  const extensions = useMemo(() => {
    const extensions: Extension[] = [...pExtensions];
    const lang = loadLanguage(tab.language);
    if (lang) {
      extensions.push(lang);
    }
    return extensions;
  }, [pExtensions, tab.language]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCode(tab.code);
  }, [tab.code]);

  return (
    <CodeMirror
      key={tab.id}
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
  );
}
