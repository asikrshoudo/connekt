import type { TextStyle } from 'react-native';

export const typography = {
  display: { fontSize: 34, lineHeight: 42, fontWeight: '800', letterSpacing: -0.6 },
  largeTitle: { fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.4 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.2 },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '600', letterSpacing: -0.1 },
  headline: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  callout: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  subhead: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  footnote: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  caption: { fontSize: 11, lineHeight: 15, fontWeight: '500', letterSpacing: 0.2 },
  captionSmall: { fontSize: 10, lineHeight: 13, fontWeight: '600', letterSpacing: 0.4 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
