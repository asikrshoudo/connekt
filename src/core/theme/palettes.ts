import { darkColors, type ColorTokens } from './colors';
import type { ThemeId } from './themeSettings';

// TheKami's Core: lime accent and neutral greys, from thekami.com and the blog.
// Chat bubbles and badges use a darker lime so white text stays readable.
const coreLight: ColorTokens = {
  background: '#ffffff',
  surface: '#f4f4f5',
  surfaceElevated: '#ffffff',
  border: '#e5e5e5',
  textPrimary: '#0a0a0a',
  textSecondary: '#525252',
  textMuted: '#737373',
  accent: '#497d00',
  onAccent: '#f7fee7',
  destructive: '#dc2626',
  success: '#16a34a',
  warning: '#d97706',
  bubbleOutgoing: '#497d00',
  bubbleIncoming: '#f4f4f5',
  unread: '#497d00',
  disabled: '#d4d4d4',
  tabBar: '#ffffff',
  tabIndicator: 'rgba(0,0,0,0.08)',
  scrim: 'rgba(0,0,0,0.35)',
  inputBorder: 'rgba(0,0,0,0.15)',
};

// Material 3 baseline palette.
const materialLight: ColorTokens = {
  background: '#FEF7FF',
  surface: '#F3EDF7',
  surfaceElevated: '#ECE6F0',
  border: '#CAC4D0',
  textPrimary: '#1D1B20',
  textSecondary: '#49454F',
  textMuted: '#6E6975',
  accent: '#6750A4',
  onAccent: '#FFFFFF',
  destructive: '#B3261E',
  success: '#2E7D32',
  warning: '#B26A00',
  bubbleOutgoing: '#6750A4',
  bubbleIncoming: '#E7E0EC',
  unread: '#6750A4',
  disabled: '#CAC4D0',
  tabBar: '#F3EDF7',
  tabIndicator: '#E8DEF8',
  scrim: 'rgba(0,0,0,0.35)',
  inputBorder: '#79747E',
};

const materialDark: ColorTokens = {
  background: '#141218',
  surface: '#211F26',
  surfaceElevated: '#2B2930',
  border: '#49454F',
  textPrimary: '#E6E0E9',
  textSecondary: '#CAC4D0',
  textMuted: '#938F99',
  accent: '#D0BCFF',
  onAccent: '#EADDFF',
  destructive: '#F2B8B5',
  success: '#A8DAB5',
  warning: '#FFB951',
  bubbleOutgoing: '#4F378B',
  bubbleIncoming: '#36343B',
  unread: '#4F378B',
  disabled: '#49454F',
  tabBar: '#211F26',
  tabIndicator: '#4A4458',
  scrim: 'rgba(0,0,0,0.5)',
  inputBorder: '#49454F',
};

export const palettes: Record<ThemeId, { light: ColorTokens; dark: ColorTokens }> = {
  core: { light: coreLight, dark: darkColors },
  material: { light: materialLight, dark: materialDark },
};

export const themeNames: Record<ThemeId, string> = {
  core: "TheKami's Core",
  material: 'Material',
};
