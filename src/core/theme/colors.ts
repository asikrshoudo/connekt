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

// TheKami's Core, dark. Also the fallback before the saved theme loads.
export const darkColors: ColorTokens = {
  background: '#0a0a0a',
  surface: '#171717',
  surfaceElevated: '#262626',
  border: 'rgba(255,255,255,0.10)',
  textPrimary: '#fafafa',
  textSecondary: '#a3a3a3',
  textMuted: '#8f8f8f',
  accent: '#5ea500',
  onAccent: '#f7fee7',
  destructive: '#f87171',
  success: '#4ade80',
  warning: '#fbbf24',
  bubbleOutgoing: '#497d00',
  bubbleIncoming: '#262626',
  unread: '#497d00',
  disabled: '#404040',
  tabBar: '#171717',
  tabIndicator: 'rgba(255,255,255,0.12)',
  scrim: 'rgba(0,0,0,0.5)',
  inputBorder: 'rgba(255,255,255,0.18)',
};
