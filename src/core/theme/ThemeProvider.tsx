import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { usePreferencesStore } from '@core/storage/preferencesStore';
import { getTheme, Theme, ThemeMode } from './tokens';

const ThemeContext = createContext<Theme>(getTheme('light'));

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const themePreference = usePreferencesStore((s) => s.themePreference);

  const resolvedMode: ThemeMode = useMemo(() => {
    if (themePreference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return themePreference;
  }, [themePreference, systemScheme]);

  const theme = useMemo(() => getTheme(resolvedMode), [resolvedMode]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** Returns the fully resolved theme (colors/typography/spacing/...). */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
