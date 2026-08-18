import { AppSettings } from '@domain/models';
import { ThemePreference } from '@core/storage/preferencesStore';

/**
 * Clean interface for reading/writing app settings. Features depend on this
 * interface, not on the concrete storage mechanism (AsyncStorage, SQLite...).
 */
export interface SettingsRepository {
  getSettings(): AppSettings;
  setThemePreference(pref: ThemePreference): void;
  setNotificationsEnabled(enabled: boolean): void;
}
