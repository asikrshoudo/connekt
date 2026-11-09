export type ColorTokens = {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  onAccent: string;
  destructive: string;
  success: string;
  warning: string;
  bubbleOutgoing: string;
  bubbleIncoming: string;
  unread: string;
  disabled: string;
  tabBar: string;
  tabIndicator: string;
  scrim: string;
  inputBorder: string;
};

// Myth's dark palette. Also the fallback before the saved theme loads.
export const darkColors: ColorTokens = {
  background: '#101522',
  surface: '#171e2d',
  surfaceElevated: '#202a3c',
  border: 'rgba(225,233,255,0.11)',
  textPrimary: '#f3f5fb',
  textSecondary: '#b3bdcf',
  textMuted: '#8490a5',
  accent: '#9ab0ff',
  onAccent: '#111a3a',
  destructive: '#ff8585',
  success: '#77d7ac',
  warning: '#f2c56b',
  bubbleOutgoing: '#435ba8',
  bubbleIncoming: '#202a3c',
  unread: '#91a9ff',
  disabled: '#394357',
  tabBar: '#171e2d',
  tabIndicator: 'rgba(154,176,255,0.14)',
  scrim: 'rgba(5,9,16,0.68)',
  inputBorder: 'rgba(225,233,255,0.20)',
};
