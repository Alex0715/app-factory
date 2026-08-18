import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@core/theme';
import { AppCard, PrimaryButton, SecondaryButton } from '@core/ui';
import { analytics } from '@core/analytics';
import { productConfig } from '@core/config';
import { routes } from '@core/navigation';

/**
 * Placeholder home screen. This is the primary screen a new product should
 * replace with its own feature - everything else in the skeleton (theme,
 * navigation, settings, paywall) stays as-is.
 */
export function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    analytics.trackScreen('home');
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.md }}
    >
      <Text style={[theme.typography.title, { color: theme.colors.textPrimary }]}>{productConfig.appName}</Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
        This home screen is a placeholder. Build your product&apos;s core feature here.
      </Text>

      <AppCard style={{ marginTop: theme.spacing.lg }}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary }]}>Try the subscription flow</Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 4 }]}>
          The paywall screen and billing abstraction are ready to wire up to real product IDs.
        </Text>
        <PrimaryButton
          label="View plans"
          onPress={() => router.push(routes.paywall)}
          style={{ marginTop: theme.spacing.md }}
        />
      </AppCard>

      <View style={{ marginTop: theme.spacing.md }}>
        <SecondaryButton label="Settings" onPress={() => router.push(routes.settings)} />
      </View>
    </ScrollView>
  );
}
