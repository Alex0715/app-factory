import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '@core/common';
import { ErrorBoundary, OfflineBanner } from '@core/ui';
import { usePreferencesStore } from '@core/storage/preferencesStore';
import { initDatabase } from '@core/database';
import { useTheme } from '@core/theme';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore - happens if already hidden (e.g. fast refresh).
});

function RootNavigator() {
  const theme = useTheme();
  const hasHydrated = usePreferencesStore((s) => s.hasHydrated);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .catch(() => undefined)
      .finally(() => setDbReady(true));
  }, []);

  useEffect(() => {
    if (hasHydrated && dbReady) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [hasHydrated, dbReady]);

  if (!hasHydrated || !dbReady) {
    // Native splash screen is still showing at this point.
    return null;
  }

  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="about" options={{ presentation: 'card' }} />
        <Stack.Screen name="privacy" options={{ presentation: 'card' }} />
        <Stack.Screen name="feedback" options={{ presentation: 'card' }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <RootNavigator />
      </ErrorBoundary>
    </AppProviders>
  );
}
