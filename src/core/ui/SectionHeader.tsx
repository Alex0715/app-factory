import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

/** Generic uppercase-label section header used above grouped lists (e.g. Settings). */
export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.lg }]}>
      <Text
        style={[theme.typography.label, { color: theme.colors.textSecondary, textTransform: 'uppercase' }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {subtitle ? (
        <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 4,
  },
});
