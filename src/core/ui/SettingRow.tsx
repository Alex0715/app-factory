import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';

export interface SettingRowProps {
  label: string;
  description?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
}

/** Generic tappable settings list row with a label, optional description, and trailing content. */
export function SettingRow({ label, description, onPress, trailing, destructive = false }: SettingRowProps) {
  const theme = useTheme();
  const textColor = destructive ? theme.colors.danger : theme.colors.textPrimary;

  const content = (
    <View
      style={[
        styles.container,
        {
          minHeight: theme.dimensions.minTouchTarget,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.text}>
        <Text style={[theme.typography.body, { color: textColor }]}>{label}</Text>
        {description ? (
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
            {description}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={description}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
    marginRight: 12,
  },
});
