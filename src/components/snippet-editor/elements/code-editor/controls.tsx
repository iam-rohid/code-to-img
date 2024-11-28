import { useMemo } from "react";
import Color from "color";

import { CodeEditorTheme } from "@/lib/constants/code-editor-themes";

function MacOSControl() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-[12px] w-[12px] flex-shrink-0 rounded-full bg-[#FF5F57]" />
      <div className="h-[12px] w-[12px] flex-shrink-0 rounded-full bg-[#FEBC2E]" />
      <div className="h-[12px] w-[12px] flex-shrink-0 rounded-full bg-[#28C840]" />
    </div>
  );
}
function MacOSMutedControl({ theme }: { theme?: CodeEditorTheme }) {
  const color = useMemo(
    () =>
      theme
        ? theme.isDark
          ? Color(theme.settings.background).lighten(2)
          : Color(theme.settings.background).darken(0.3)
        : Color("#71717a"),
    [theme],
  );

  return (
    <div className="flex items-center gap-2">
      <div
        className="h-[12px] w-[12px] flex-shrink-0 rounded-full"
        style={{ backgroundColor: color.toString() }}
      />
      <div
        className="h-[12px] w-[12px] flex-shrink-0 rounded-full"
        style={{ backgroundColor: color.toString() }}
      />
      <div
        className="h-[12px] w-[12px] flex-shrink-0 rounded-full"
        style={{ backgroundColor: color.toString() }}
      />
    </div>
  );
}
function MacOSOutlinedControl() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-[12px] w-[12px] flex-shrink-0 rounded-full border-2 border-[#FF5F57]" />
      <div className="h-[12px] w-[12px] flex-shrink-0 rounded-full border-2 border-[#FEBC2E]" />
      <div className="h-[12px] w-[12px] flex-shrink-0 rounded-full border-2 border-[#28C840]" />
    </div>
  );
}
function MacOSOutlinedMutedControl({ theme }: { theme?: CodeEditorTheme }) {
  const color = useMemo(
    () =>
      theme
        ? theme.isDark
          ? Color(theme.settings.background).lighten(2)
          : Color(theme.settings.background).darken(0.3)
        : Color("#71717a"),
    [theme],
  );

  return (
    <div className="flex items-center gap-2">
      <div
        className="h-[12px] w-[12px] flex-shrink-0 rounded-full border"
        style={{
          borderColor: color.toString(),
        }}
      />
      <div
        className="h-[12px] w-[12px] flex-shrink-0 rounded-full border"
        style={{
          borderColor: color.toString(),
        }}
      />
      <div
        className="h-[12px] w-[12px] flex-shrink-0 rounded-full border"
        style={{
          borderColor: color.toString(),
        }}
      />
    </div>
  );
}
function WindowsControl({ theme }: { theme?: CodeEditorTheme }) {
  const color = useMemo(
    () =>
      theme
        ? theme.isDark
          ? Color(theme.settings.background).lighten(2)
          : Color(theme.settings.background).darken(0.3)
        : Color("#71717a"),
    [theme],
  );

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-[12px] w-[12px]">
        <div
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
          style={{
            backgroundColor: color.toString(),
          }}
        ></div>
      </div>
      <div
        className="relative h-[12px] w-[12px] border"
        style={{
          borderColor: color.toString(),
        }}
      />
      <div className="relative h-[12px] w-[12px]">
        <div
          className="absolute left-1/2 top-1/2 h-px w-[calc(100%+4px)] -translate-x-1/2 -translate-y-1/2 rotate-45"
          style={{
            backgroundColor: color.toString(),
          }}
        ></div>
        <div
          className="absolute left-1/2 top-1/2 h-px w-[calc(100%+4px)] -translate-x-1/2 -translate-y-1/2 -rotate-45"
          style={{
            backgroundColor: color.toString(),
          }}
        ></div>
      </div>
    </div>
  );
}

export const TITLE_BAR_CONTROLS = [
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
