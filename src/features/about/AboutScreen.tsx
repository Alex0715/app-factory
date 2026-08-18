import React from 'react';
import { Linking, ScrollView, Text } from 'react-native';
import { useTheme } from '@core/theme';
import { productConfig } from '@core/config';
import { SectionHeader, SettingRow } from '@core/ui';

export function AboutScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Text
        style={[
          theme.typography.title,
          { color: theme.colors.textPrimary, padding: theme.spacing.md },
        ]}
      >
        {productConfig.appName}
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, paddingHorizontal: theme.spacing.md }]}>
        {productConfig.description}
      </Text>

      <SectionHeader title="Details" />
      <SettingRow label="Version" description={productConfig.version} />

      <SectionHeader title="Links" />
      <SettingRow label="Website" onPress={() => Linking.openURL(productConfig.urls.website)} />
      <SettingRow label="Terms of service" onPress={() => Linking.openURL(productConfig.urls.termsOfService)} />
    </ScrollView>
  );
}
