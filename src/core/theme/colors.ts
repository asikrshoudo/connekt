export const darkColors = {
  background: '#0A0A0C',
  surface: '#151518',
  surfaceElevated: '#1F1F23',
  border: 'rgba(255,255,255,0.08)',
  textPrimary: '#F5F5F7',
  textSecondary: '#A1A1A8',
  textMuted: '#8A8A92',
  accent: '#0A84FF',
  onAccent: '#FFFFFF',
  destructive: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  bubbleOutgoing: '#0A6CDB',
  bubbleIncoming: '#1F1F23',
  unread: '#0A6CDB',
  disabled: '#48484F',
  tabBar: '#1A1A1E',
  tabIndicator: 'rgba(255,255,255,0.12)',
  scrim: 'rgba(0,0,0,0.5)',
  inputBorder: 'rgba(255,255,255,0.18)',
} as const;

export type ColorTokens = { [K in keyof typeof darkColors]: string };
