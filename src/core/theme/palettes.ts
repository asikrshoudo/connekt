import { darkColors, type ColorTokens } from './colors';
import type { ThemeId } from './themeSettings';

// Myth's cool indigo accent with quiet neutral surfaces.
const coreLight: ColorTokens = {
  background: '#ffffff',
  surface: '#f5f6fa',
  surfaceElevated: '#ffffff',
  border: '#e4e7ef',
  textPrimary: '#171c2a',
  textSecondary: '#525c70',
  textMuted: '#69758a',
  accent: '#435fc2',
  onAccent: '#ffffff',
  destructive: '#c83e49',
  success: '#197c56',
  warning: '#986200',
  bubbleOutgoing: '#435fc2',
  bubbleIncoming: '#f0f2f7',
  unread: '#435fc2',
  disabled: '#d5d9e3',
  tabBar: '#ffffff',
  tabIndicator: 'rgba(67,95,194,0.10)',
  scrim: 'rgba(12,17,29,0.42)',
  inputBorder: '#cbd1de',
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
  core: 'Myth',
  material: 'Material',
};
