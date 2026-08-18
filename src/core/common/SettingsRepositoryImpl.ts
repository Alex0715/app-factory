import { AppSettings } from '@domain/models';
import { SettingsRepository } from '@domain/repositories';
import { usePreferencesStore, ThemePreference } from '@core/storage/preferencesStore';

/** Concrete SettingsRepository backed by the DataStore-equivalent preferences store. */
export const settingsRepository: SettingsRepository = {
  getSettings(): AppSettings {
    const state = usePreferencesStore.getState();
    return {
      themePreference: state.themePreference,
      notificationsEnabled: state.notificationsEnabled,
    };
  },
  setThemePreference(pref: ThemePreference): void {
    usePreferencesStore.getState().setThemePreference(pref);
  },
  setNotificationsEnabled(enabled: boolean): void {
    usePreferencesStore.getState().setNotificationsEnabled(enabled);
  },
};
