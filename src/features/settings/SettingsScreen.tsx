import React, { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@core/theme';
import { SectionHeader, SettingRow, ToggleSettingRow } from '@core/ui';
import { usePreferencesStore, ThemePreference } from '@core/storage/preferencesStore';
import { analytics } from '@core/analytics';
import { routes } from '@core/navigation';
import { productConfig } from '@core/config';

const THEME_LABELS: Record<ThemePreference, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

export function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const themePreference = usePreferencesStore((s) => s.themePreference);
  const setThemePreference = usePreferencesStore((s) => s.setThemePreference);
  const notificationsEnabled = usePreferencesStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = usePreferencesStore((s) => s.setNotificationsEnabled);

  useEffect(() => {
    analytics.trackScreen('settings');
  }, []);

  const cycleTheme = () => {
    const order: ThemePreference[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(themePreference) + 1) % order.length];
    setThemePreference(next);
    analytics.trackFeatureUsed('theme_changed', { theme: next });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SectionHeader title="Appearance" />
      <SettingRow
        label="Theme"
        description={THEME_LABELS[themePreference]}
        onPress={cycleTheme}
        trailing={
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Tap to change</Text>
        }
      />

      <SectionHeader title="Notifications" />
      <ToggleSettingRow
        label="Push notifications"
        description="Receive updates and reminders"
        value={notificationsEnabled}
        onValueChange={(value) => setNotificationsEnabled(value)}
      />

      <SectionHeader title="Subscription" />
      <SettingRow label="Manage subscription" onPress={() => router.push(routes.paywall)} />

      <SectionHeader title="About" />
      <SettingRow label="About" onPress={() => router.push(routes.about)} />
      <SettingRow label="Privacy policy" onPress={() => router.push(routes.privacy)} />
      <SettingRow label="Feedback & support" onPress={() => router.push(routes.feedback)} />
      <SettingRow label="Version" description={productConfig.version} />
    </ScrollView>
  );
}
