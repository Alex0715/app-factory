import { darkColors, lightColors, ThemeColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radii, elevation } from './shapes';
import { dimensions } from './dimensions';

export type ThemeMode = 'light' | 'dark';

/** The fully resolved theme object consumed by components via useTheme(). */
export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  elevation: typeof elevation;
  dimensions: typeof dimensions;
}

function buildTheme(mode: ThemeMode): Theme {
  return {
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
    typography,
    spacing,
    radii,
    elevation,
    dimensions,
  };
}

export const lightTheme = buildTheme('light');
export const darkTheme = buildTheme('dark');

export function getTheme(mode: ThemeMode): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
