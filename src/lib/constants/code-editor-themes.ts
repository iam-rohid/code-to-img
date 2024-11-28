import { type CreateThemeOptions } from "@uiw/codemirror-themes";
import {
  defaultSettingsDracula,
  defaultSettingsTokyoNight,
  defaultSettingsTokyoNightDay,
  defaultSettingsVscodeDark,
  defaultSettingsVscodeLight,
  defaultSettingsAura,
  defaultSettingsXcodeLight,
  defaultSettingsXcodeDark,
  defaultSettingsSolarizedDark,
  defaultSettingsSolarizedLight,
  draculaInit,
  tokyoNightDayInit,
  tokyoNightInit,
  vscodeDarkInit,
  vscodeLightInit,
  defaultSettingsBasicDark,
  defaultSettingsBasicLight,
  basicDarkInit,
  basicLightInit,
  auraInit,
  xcodeLightInit,
  xcodeDarkInit,
  solarizedLightInit,
  solarizedDarkInit,
} from "@uiw/codemirror-themes-all";
import { Extension } from "@uiw/react-codemirror";

export interface CodeEditorTheme {
  id: string;
  name: string;
  isDark: boolean;
  theme: Extension;
  settings: CreateThemeOptions["settings"];
}

const defaultInitOptions: Partial<CreateThemeOptions> = {
  settings: {
    background: "transparent",
    gutterBackground: "transparent",
    gutterBorder: "transparent",
  },
};

export const CODE_EDITOR_THEMES: CodeEditorTheme[] = [
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    isDark: true,
    theme: tokyoNightInit(defaultInitOptions),
    settings: defaultSettingsTokyoNight,
  },
  {
    id: "tokyo-night-day",
    name: "Tokyo Night Day",
    isDark: false,
    theme: tokyoNightDayInit(defaultInitOptions),
    settings: defaultSettingsTokyoNightDay,
  },
  {
    id: "dracula",
    name: "Dracula",
    isDark: true,
    theme: draculaInit(defaultInitOptions),
    settings: defaultSettingsDracula,
  },
  {
    id: "vscode-light",
    name: "VS Code Light",
    isDark: false,
    theme: vscodeLightInit(defaultInitOptions),
    settings: defaultSettingsVscodeLight,
  },
  {
    id: "vscode-dark",
    name: "VS Code Dark",
    isDark: true,
    theme: vscodeDarkInit(defaultInitOptions),
    settings: defaultSettingsVscodeDark,
  },
  {
    id: "basic-dark",
    name: "Basic Dark",
    isDark: true,
    theme: basicDarkInit(defaultInitOptions),
    settings: defaultSettingsBasicDark,
  },
  {
    id: "basic-light",
    name: "Basic Light",
    isDark: false,
    theme: basicLightInit(defaultInitOptions),
    settings: defaultSettingsBasicLight,
  },
  {
    id: "aura",
    name: "Aura",
    isDark: true,
    theme: auraInit(defaultInitOptions),
    settings: defaultSettingsAura,
  },
  {
    id: "xcode-dark",
    name: "xCode Dark",
    isDark: true,
    theme: xcodeDarkInit(defaultInitOptions),
    settings: defaultSettingsXcodeDark,
  },
  {
    id: "xcode-light",
    name: "xCode Light",
    isDark: false,
    theme: xcodeLightInit(defaultInitOptions),
    settings: defaultSettingsXcodeLight,
  },
  {
    id: "solarized-dark",
    name: "Solarized Dark",
    isDark: true,
    theme: solarizedDarkInit(defaultInitOptions),
    settings: defaultSettingsSolarizedDark,
  },
  {
    id: "solarized-light",
    name: "Solarized Light",
    isDark: false,
    theme: solarizedLightInit(defaultInitOptions),
    settings: defaultSettingsSolarizedLight,
  },
];

export const DEFAULT_THEME = "dracula";
