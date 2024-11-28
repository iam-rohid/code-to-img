import { type CreateThemeOptions } from "@uiw/codemirror-themes";
import {
  defaultSettingsDracula,
  defaultSettingsTokyoNight,
  defaultSettingsTokyoNightDay,
  defaultSettingsVscodeDark,
  defaultSettingsVscodeLight,
  draculaInit,
  tokyoNightDayInit,
  tokyoNightInit,
  vscodeDarkInit,
  vscodeLightInit,
} from "@uiw/codemirror-themes-all";
import { Extension } from "@uiw/react-codemirror";

const defaultInitOptions: Partial<CreateThemeOptions> = {
  settings: {
    background: "transparent",
    gutterBackground: "transparent",
    gutterBorder: "transparent",
  },
};

export const CODE_EDITOR_THEMES: {
  id: string;
  name: string;
  theme: Extension;
  settings: CreateThemeOptions["settings"];
}[] = [
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    theme: tokyoNightInit(defaultInitOptions),
    settings: defaultSettingsTokyoNight,
  },
  {
    id: "tokyo-night-day",
    name: "Tokyo Night Day",
    theme: tokyoNightDayInit(defaultInitOptions),
    settings: defaultSettingsTokyoNightDay,
  },
  {
    id: "dracula",
    name: "Dracula",
    theme: draculaInit(defaultInitOptions),
    settings: defaultSettingsDracula,
  },
  {
    id: "vscode-light",
    name: "VS Code Light",
    theme: vscodeLightInit(defaultInitOptions),
    settings: defaultSettingsVscodeLight,
  },
  {
    id: "vscode-dark",
    name: "VS Code Dark",
    theme: vscodeDarkInit(defaultInitOptions),
    settings: defaultSettingsVscodeDark,
  },
];

export const DEFAULT_THEME = "dracula";
