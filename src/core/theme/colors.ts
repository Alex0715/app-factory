/**
 * Raw color palette. This is the ONE file a new product typically edits to
 * swap its entire visual identity. Everything else in the app consumes
 * semantic tokens from `tokens.ts`, never these raw values directly.
 */
export const palette = {
  brand50: '#EEF2FF',
  brand100: '#E0E7FF',
  brand300: '#A5B4FC',
  brand500: '#6366F1',
  brand600: '#4F46E5',
  brand700: '#4338CA',

  neutral0: '#FFFFFF',
  neutral50: '#FAFAFA',
  neutral100: '#F4F4F5',
  neutral200: '#E4E4E7',
  neutral300: '#D4D4D8',
  neutral400: '#A1A1AA',
  neutral500: '#71717A',
  neutral600: '#52525B',
  neutral700: '#3F3F46',
  neutral800: '#27272A',
  neutral900: '#18181B',
  neutral950: '#0A0A0B',

  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#0284C7',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceVariant: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textOnBrand: string;
  primary: string;
  primaryVariant: string;
  onPrimary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  background: palette.neutral0,
  surface: palette.neutral50,
  surfaceVariant: palette.neutral100,
  border: palette.neutral200,

  textPrimary: palette.neutral900,
  textSecondary: palette.neutral600,
  textDisabled: palette.neutral400,
  textOnBrand: palette.neutral0,

  primary: palette.brand600,
  primaryVariant: palette.brand700,
  onPrimary: palette.neutral0,

  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,

  overlay: 'rgba(0,0,0,0.4)',
};

export const darkColors: ThemeColors = {
  background: palette.neutral950,
  surface: palette.neutral900,
  surfaceVariant: palette.neutral800,
  border: palette.neutral700,

  textPrimary: palette.neutral50,
  textSecondary: palette.neutral400,
  textDisabled: palette.neutral600,
  textOnBrand: palette.neutral0,

  primary: palette.brand500,
  primaryVariant: palette.brand300,
  onPrimary: palette.neutral950,

  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,

  overlay: 'rgba(0,0,0,0.6)',
};
