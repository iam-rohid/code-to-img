/** @jsxImportSource @emotion/react */

import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror, {
  EditorView,
  Extension,
  lineNumbers,
} from "@uiw/react-codemirror";
import Color from "color";
import { PlusIcon, XIcon } from "lucide-react";
import { nanoid } from "nanoid";

import {
  CODE_EDITOR_THEMES,
  CodeEditorTheme,
} from "@/lib/constants/code-editor-themes";
import { cn } from "@/lib/utils";
import { CodeEditorTab, iCodeEditorElement } from "@/lib/validator/elements";
import { useDragElement } from "../../use-drag-element";

import { TITLE_BAR_CONTROLS } from "./controls";

const MAX_TABS = 4;

export default function CodeEditorElement({
  element,
  readOnly,
  onChange,
  onTabSelect,
  onDragEnd,
  onDragStart,
  zoom = 1,
  onEditingEnd,
  onEditingStart,
}: {
  element: iCodeEditorElement;
  readOnly?: boolean;
  onChange?: (element: Partial<iCodeEditorElement>) => void;
  onTabSelect?: (tabId: string) => void;
  zoom?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onEditingStart?: () => void;
  onEditingEnd?: () => void;
}) {
  const [selectedTabId, setSelectedTabId] = useState(() => element.tabs[0].id);
  const { onMouseDown } = useDragElement({
    x: element.x,
    y: element.y,
    zoom,
    readOnly,
    onDrag: (pos) => onChange?.({ x: pos.x, y: pos.y }),
    onDoubleClick: () => {
      // setEditing(true);
    },
    onDragEnd,
    onDragStart,
  });

  const theme = useMemo(
    () =>
      CODE_EDITOR_THEMES.find((theme) => theme.id === element.theme) ??
      CODE_EDITOR_THEMES[0]!,
    [element.theme],
  );
  const background = useMemo(
    () => Color(theme.settings.background),
    [theme.settings.background],
  );
  const secondaryBackground = useMemo(
    () => (theme.isDark ? background.darken(0.3) : background.darken(0.05)),
    [background, theme.isDark],
  );
  const secondaryBackground2 = useMemo(
    () => (theme.isDark ? background.lighten(0.4) : background.darken(0.1)),
    [background, theme.isDark],
  );
  const borderColor = useMemo(
    () => (theme.isDark ? background.lighten(1) : background.darken(0.2)),
    [background, theme.isDark],
  );

  const extensions = useMemo(() => {
    const extensions: Extension[] = [];
    if (!element.autoWidth) {
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
    element.autoWidth,
    element.lineNumbersStartFrom,
    element.showLineNumbers,
  ]);

  const handleAddNewTab = useCallback(() => {
    if (element.tabs.length >= MAX_TABS) {
      return;
    }
    const newTab: CodeEditorTab = {
      id: nanoid(),
      code: "// Enter your code here",
      language: "javascript",
      name: "index.js",
    };
    onChange?.({
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
    <div
      className="code-editor relative flex h-full w-full flex-col"
      style={{
        backgroundImage: theme.settings.backgroundImage,
        backgroundColor: theme.settings.background,
        color: theme.settings.foreground,
        boxShadow: element.boxShadow,
        borderRadius: element.borderRadius,
      }}
    >
      {element.showTitleBar ? (
        <TitleBar
          background={background}
          borderColor={borderColor}
          element={element}
          secondaryBackground={secondaryBackground}
          onAddTabClick={handleAddNewTab}
          onRemoveTabClick={handleRemoveTab}
          secondaryBackground2={secondaryBackground2}
          theme={theme}
          readOnly={readOnly}
          selectedTabId={selectedTabId}
          onSelectedTabChange={setSelectedTabId}
          onMouseDown={onMouseDown}
        />
      ) : (
        <div
          className="absolute left-0 right-0 top-0 z-10 h-4"
          onMouseDown={onMouseDown}
        />
      )}

      {element.tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn("overflow-hidden", {
            hidden: selectedTabId !== tab.id,
          })}
        >
          <TabContent
            key={tab.id}
            tab={tab}
            extensions={extensions}
            theme={theme.theme}
            element={element}
            onCodeChange={(code) =>
              onChange?.({
                tabs: element.tabs.map((oldTab) =>
                  oldTab.id === tab.id ? { ...oldTab, code } : oldTab,
                ),
              })
            }
            onFocus={onEditingStart}
            onBlur={onEditingEnd}
            readOnly={readOnly}
          />
        </div>
      ))}

      {element.border && (
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            boxShadow: `inset 0 0 0 1px ${borderColor}, 0 0 0 0.5px rgba(0,0,0,${theme.isDark ? 0.8 : 0.4})`,
            borderRadius: element.borderRadius,
          }}
        />
      )}
    </div>
  );
}

function TabContent({
  tab,
  extensions: pExtensions = [],
  element,
  theme,
  onCodeChange,
  readOnly,
  onBlur,
  onFocus,
}: {
  tab: CodeEditorTab;
  extensions?: Extension[];
  theme: Extension;
  onCodeChange?: (value: string) => void;
  readOnly?: boolean;
  element: iCodeEditorElement;
  onFocus?: () => void;
  onBlur?: () => void;
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
      theme={theme}
      height={element.autoHeight ? undefined : "100%"}
      width={element.autoWidth ? undefined : `100%`}
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
      onFocus={onFocus}
      onBlur={onBlur}
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
        outline: "none",
      }}
      css={{
        ".cm-focused": {
          outline: "none",
        },
      }}
    />
  );
}

function TitleBar({
  element,
  secondaryBackground,
  theme,
  secondaryBackground2,
  readOnly,
  onAddTabClick,
  onRemoveTabClick,
  selectedTabId,
  onSelectedTabChange,
  onMouseDown,
}: {
  element: iCodeEditorElement;
  background: Color;
  secondaryBackground: Color;
  borderColor: Color;
  secondaryBackground2: Color;
  theme: CodeEditorTheme;
  readOnly?: boolean;
  onRemoveTabClick: (tabId: string) => void;
  onAddTabClick: () => void;
  selectedTabId: string;
  onSelectedTabChange: (tabId: string) => void;
  onMouseDown?: (e: MouseEvent) => void;
}) {
  const Control = useMemo(
    () =>
      TITLE_BAR_CONTROLS.find(
        (control) => control.id === element.titleBarControlStyle,
      )?.Control,
    [element.titleBarControlStyle],
  );

  return (
    <div
      className="relative z-20 flex-shrink-0 overflow-hidden"
      style={{
        backgroundColor: secondaryBackground.toString(),
        borderTopLeftRadius: element.borderRadius,
        borderTopRightRadius: element.borderRadius,
      }}
    >
      <div className="absolute inset-0" onMouseDown={onMouseDown}></div>
      <div
        className={cn("flex h-10 items-center", {
          "flex-row-reverse": element.titleBarControlPosition === "right",
        })}
      >
        {Control ? (
          <div className="pointer-events-none flex-shrink-0 px-4">
            <Control theme={theme} />
          </div>
        ) : (
          <div className="w-2" />
        )}
        <div
          className={cn("pointer-events-none z-10 flex h-full flex-1", {
            "flex-row-reverse": element.titleBarControlPosition === "right",
          })}
        >
          <div className="flex flex-1 flex-shrink items-center gap-1">
            {element.tabs.map((tab) => {
              const selected = selectedTabId === tab.id;
              return (
                <TabItem
                  selected={selected}
                  onSelect={onSelectedTabChange}
                  onRemove={onRemoveTabClick}
                  secondaryBackground2={secondaryBackground2}
                  tab={tab}
                  tabsCount={element.tabs.length}
                  readOnly={readOnly}
                  key={tab.id}
                  theme={theme}
                  secondaryBackground={secondaryBackground}
                />
              );
            })}
          </div>

          {!readOnly && element.tabs.length < MAX_TABS ? (
            <div className="flex items-center justify-center p-1">
              <button
                className="pointer-events-auto flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                onClick={onAddTabClick}
                css={{
                  ":hover": {
                    backgroundColor: secondaryBackground2.toString(),
                  },
                }}
              >
                <PlusIcon className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="w-2" />
          )}
        </div>
      </div>
    </div>
  );
}

function TabItem({
  selected,
  tab,
  onSelect,
  secondaryBackground,
  secondaryBackground2,
  readOnly,
  tabsCount,
  onRemove,
  theme,
}: {
  tab: CodeEditorTab;
  selected: boolean;
  secondaryBackground: Color;
  secondaryBackground2: Color;
  onSelect: (tabId: string) => void;
  readOnly?: boolean;
  tabsCount: number;
  onRemove?: (tabId: string) => void;
  theme: CodeEditorTheme;
}) {
  const [mouseHovering, setMouseHovering] = useState(false);
  return (
    <div
      className={cn(
        "group/tab pointer-events-auto relative flex h-full max-w-[128px] flex-1 flex-shrink py-1",
        {
          "-z-10": selected,
        },
      )}
      onMouseEnter={() => setMouseHovering(true)}
      onMouseLeave={() => setMouseHovering(false)}
    >
      {selected && (
        <div
          className="pointer-events-none absolute -bottom-1 left-0 right-0 h-2"
          style={{
            backgroundColor: theme.settings.background,
          }}
        >
          <div
            style={{
              background: theme.settings.background,
              height: "16px",
              width: "16px",
              position: "absolute",
              bottom: "4px",
              right: "-8px",
              borderRadius: "0 0 0 8px",
            }}
          ></div>
          <div
            style={{
              background: secondaryBackground.toString(),
              height: "16px",
              width: "16px",
              position: "absolute",
              bottom: "4px",
              right: "-16px",
              borderRadius: "0 0 0 8px",
            }}
          ></div>
          <div
            style={{
              background: theme.settings.background,
              height: "16px",
              width: "16px",
              position: "absolute",
              bottom: "4px",
              left: "-8px",
              borderRadius: "0 0 8px 0",
            }}
          ></div>
          <div
            style={{
              background: secondaryBackground.toString(),
              height: "16px",
              width: "16px",
              position: "absolute",
              bottom: "4px",
              left: "-16px",
              borderRadius: "0 0 8px 0",
            }}
          ></div>
        </div>
      )}
      <div
        className={cn(
          "pointer-events-auto relative flex h-full flex-1 cursor-pointer select-none items-center overflow-hidden truncate rounded-t-md px-2 text-center text-xs font-medium",
          {
            "rounded-md": !selected,
          },
        )}
        style={{
          backgroundColor: selected
            ? theme.settings.background
            : mouseHovering
              ? theme.settings.background
              : "transparent",
        }}
        onMouseDown={() => onSelect(tab.id)}
      >
        <span
          className="absolute left-2 top-1/2 -translate-y-1/2 truncate text-left"
          style={{
            right: !readOnly && mouseHovering ? "20px" : "8px",
          }}
        >
          {tab.name || "Untitled"}
        </span>
      </div>
      {!readOnly && tabsCount > 1 && (
        <div className="absolute right-1 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover/tab:opacity-100">
          <div
            className="pointer-events-auto flex h-4 w-4 cursor-pointer items-center justify-center rounded-full hover:bg-secondary"
            onClick={() => onRemove?.(tab.id)}
            css={{
              ":hover": {
                backgroundColor: secondaryBackground2.toString(),
              },
            }}
          >
            <XIcon className="h-3 w-3" />
          </div>
        </div>
      )}
    </div>
  );
}
