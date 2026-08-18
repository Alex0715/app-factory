import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';
import { PrimaryButton } from './AppButton';

export interface EmptyViewProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Generic empty-state placeholder for lists/screens with no data yet. */
export function EmptyView({ title, message, actionLabel, onAction }: EmptyViewProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary, textAlign: 'center' }]}>
        {title}
      </Text>
      {message ? (
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm },
          ]}
        >
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={{ marginTop: theme.spacing.lg }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
