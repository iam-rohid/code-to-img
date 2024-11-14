import { CSSProperties } from "react";
import { tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import { Extension } from "@uiw/react-codemirror";

export const codeEditorThemes: {
  id: string;
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
}[] = [
  {
    id: "tokyo-night",
    theme: tokyoNightInit(),
    window: {
      background: "#1A1B26",
      foreground: "#BBC5EE",
      titleBarBackground: "#1A1B26",
      titleBarTraficLightColor1: "#444764",
      titleBarTraficLightColor2: "#444764",
      titleBarTraficLightColor3: "#444764",
    },
  },
];
