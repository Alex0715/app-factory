import { usePreferencesStore } from '../preferencesStore';

describe('usePreferencesStore', () => {
  beforeEach(() => {
    usePreferencesStore.getState().resetPreferences();
  });

  it('defaults to onboarding not completed and system theme', () => {
    const state = usePreferencesStore.getState();
    expect(state.onboardingCompleted).toBe(false);
    expect(state.themePreference).toBe('system');
    expect(state.notificationsEnabled).toBe(true);
  });

  it('setOnboardingCompleted updates the flag', () => {
    usePreferencesStore.getState().setOnboardingCompleted(true);
    expect(usePreferencesStore.getState().onboardingCompleted).toBe(true);
  });

  it('setThemePreference updates the theme', () => {
    usePreferencesStore.getState().setThemePreference('dark');
    expect(usePreferencesStore.getState().themePreference).toBe('dark');
  });

  it('setUserSetting merges into userSettings without clobbering other keys', () => {
    const { setUserSetting } = usePreferencesStore.getState();
    setUserSetting('units', 'metric');
    setUserSetting('language', 'en');
    expect(usePreferencesStore.getState().userSettings).toEqual({ units: 'metric', language: 'en' });
  });

  it('resetPreferences restores every default value', () => {
    const store = usePreferencesStore.getState();
    store.setOnboardingCompleted(true);
    store.setThemePreference('dark');
    store.setNotificationsEnabled(false);
    store.setUserSetting('units', 'metric');

    usePreferencesStore.getState().resetPreferences();

    const state = usePreferencesStore.getState();
    expect(state.onboardingCompleted).toBe(false);
    expect(state.themePreference).toBe('system');
    expect(state.notificationsEnabled).toBe(true);
    expect(state.userSettings).toEqual({});
  });
});
