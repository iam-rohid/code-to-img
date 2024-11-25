import { CSSProperties } from "react";
import { tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import { Extension } from "@uiw/react-codemirror";

export interface iCodeEditorTheme {
  id: string;
  name: string;
  theme: Extension;
  window?: {
    background?: string;
    backgroundImage?: string;
    foreground?: string;
    titleBarBackground?: string;
    titleBarForeground?: string;
    titleBarTraficLightColor1?: string;
    titleBarTraficLightColor2?: string;
    titleBarTraficLightColor3?: string;
    style?: CSSProperties;
    titleBarStyle?: CSSProperties;
    codeMirrorContainerStyle?: CSSProperties;
    codeMirrorStyle?: CSSProperties;
  };
}

export const codeEditorThemes: iCodeEditorTheme[] = [
  {
    id: "theme-1",
    name: "Theme 1",
    theme: tokyoNightInit({
      settings: {
        background: "transparent",
        gutterBackground: "transparent",
      },
    }),
    window: {
      background: "#1A1B26",
      foreground: "#BBC5EE",
      titleBarBackground: "#1A1B26",
      style: {
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 0 0 0.5px rgba(0,0,0,0.8)",
        borderRadius: 10,
      },
      titleBarStyle: {
        backgroundColor: "transparent",
      },
      codeMirrorContainerStyle: {
        backgroundColor: "transparent",
      },
    },
  },
];
