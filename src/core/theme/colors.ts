export type ColorTokens = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceContainer: string;
  surfaceContainerLow: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  border: string;
  cardBorder: string;
  outline: string;
  outlineVariant: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  onAccent: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  destructive: string;
  success: string;
  warning: string;
  bubbleOutgoing: string;
  bubbleOutgoingText: string;
  bubbleIncoming: string;
  bubbleIncomingText: string;
  unread: string;
  disabled: string;
  tabBar: string;
  tabIndicator: string;
  scrim: string;
  inputBorder: string;
  presenceOnline: string;
  presenceAway: string;
  presenceOffline: string;
  chipBackground: string;
  chipActiveBackground: string;
};

// Myth's modern dark palette: deep indigo-tinted slate surfaces with electric indigo accents.
export const darkColors: ColorTokens = {
  background: '#0c101a',
  surface: '#131826',
  surfaceElevated: '#1a2236',
  surfaceContainer: '#161d2e',
  surfaceContainerLow: '#101522',
  surfaceContainerHigh: '#202a40',
  surfaceContainerHighest: '#27344f',
  border: 'rgba(215, 226, 255, 0.08)',
  cardBorder: 'rgba(215, 226, 255, 0.12)',
  outline: 'rgba(215, 226, 255, 0.18)',
  outlineVariant: 'rgba(215, 226, 255, 0.08)',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  accent: '#6366f1',
  onAccent: '#ffffff',
  primary: '#6366f1',
  onPrimary: '#ffffff',
  primaryContainer: 'rgba(99, 102, 241, 0.16)',
  onPrimaryContainer: '#c7d2fe',
  destructive: '#f43f5e',
  success: '#10b981',
  warning: '#f59e0b',
  bubbleOutgoing: '#4f46e5',
  bubbleOutgoingText: '#ffffff',
  bubbleIncoming: '#1b2336',
  bubbleIncomingText: '#f1f5f9',
  unread: '#6366f1',
  disabled: '#334155',
  tabBar: '#121724',
  tabIndicator: 'rgba(99, 102, 241, 0.18)',
  scrim: 'rgba(5, 8, 15, 0.72)',
  inputBorder: 'rgba(215, 226, 255, 0.14)',
  presenceOnline: '#10b981',
  presenceAway: '#f59e0b',
  presenceOffline: '#64748b',
  chipBackground: '#182032',
  chipActiveBackground: 'rgba(99, 102, 241, 0.22)',
};
