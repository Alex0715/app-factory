import { TextStyle } from 'react-native';

/**
 * Semantic type scale. Screens should reference `typography.title` etc.
 * rather than hardcoding fontSize/fontWeight values.
 */
export const typography: Record<string, TextStyle> = {
  displayLarge: { fontSize: 34, fontWeight: '700', lineHeight: 41 },
  title: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  subtitle: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  bodyEmphasis: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  label: { fontSize: 13, fontWeight: '600', lineHeight: 16, letterSpacing: 0.4 },
  button: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
};

export type TypographyVariant = keyof typeof typography;
