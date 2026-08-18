import React from 'react';
import { Linking, ScrollView, Text } from 'react-native';
import { useTheme } from '@core/theme';
import { productConfig } from '@core/config';
import { PrimaryButton } from '@core/ui';

export function PrivacyScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.md }}>
      <Text style={[theme.typography.title, { color: theme.colors.textPrimary }]}>Privacy</Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>
        Replace this placeholder with your product&apos;s actual privacy summary, or link out to your full
        privacy policy below. Configure the URL in product.config.ts.
      </Text>
      <PrimaryButton
        label="Read full privacy policy"
        onPress={() => Linking.openURL(productConfig.urls.privacyPolicy)}
        style={{ marginTop: theme.spacing.lg }}
      />
    </ScrollView>
  );
}
