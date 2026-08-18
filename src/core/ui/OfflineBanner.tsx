import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';
import { useNetworkStatus } from '@core/network';

/** Slim banner shown app-wide whenever the device has no connectivity. */
export function OfflineBanner() {
  const theme = useTheme();
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.warning }]}
      accessibilityRole="alert"
      accessibilityLabel="You are offline"
    >
      <Text style={[theme.typography.caption, { color: theme.colors.onPrimary }]}>
        You&apos;re offline. Some features may be unavailable.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
});
