import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * Lightweight app preferences, persisted to AsyncStorage via Zustand's
 * `persist` middleware. This is the store for cheap, non-sensitive settings
 * (theme, onboarding flag, notification toggle, arbitrary user settings).
 * For sensitive values (tokens, receipts) use `secureStorage` instead.
 * For structured, queryable local data use `database` (Room-equivalent: expo-sqlite).
 */
export interface PreferencesState {
  /** True once the persisted state has been read back from disk. */
  hasHydrated: boolean;
  onboardingCompleted: boolean;
  themePreference: ThemePreference;
  notificationsEnabled: boolean;
  /** Free-form per-product user settings (e.g. units, language). */
  userSettings: Record<string, string | number | boolean>;

  setHasHydrated: (value: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setThemePreference: (pref: ThemePreference) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setUserSetting: (key: string, value: string | number | boolean) => void;
  resetPreferences: () => void;
}

const defaultState = {
  onboardingCompleted: false,
  themePreference: 'system' as ThemePreference,
  notificationsEnabled: true,
  userSettings: {} as Record<string, string | number | boolean>,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      ...defaultState,

      setHasHydrated: (value) => set({ hasHydrated: value }),
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      setThemePreference: (pref) => set({ themePreference: pref }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setUserSetting: (key, value) =>
        set((state) => ({ userSettings: { ...state.userSettings, [key]: value } })),
      resetPreferences: () => set({ ...defaultState }),
    }),
    {
      name: 'app-preferences',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        onboardingCompleted: state.onboardingCompleted,
        themePreference: state.themePreference,
        notificationsEnabled: state.notificationsEnabled,
        userSettings: state.userSettings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
