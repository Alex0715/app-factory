import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';
import { PrimaryButton } from './AppButton';

export interface ErrorViewProps {
  /** User-friendly message only - never pass raw error/stack text. */
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/** Generic error state with an optional retry action. */
export function ErrorView({ message, onRetry, retryLabel = 'Try again' }: ErrorViewProps) {
  const theme = useTheme();
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary, textAlign: 'center' }]}>
        Something went wrong
      </Text>
      <Text
        style={[
          theme.typography.body,
          { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm },
        ]}
      >
        {message}
      </Text>
      {onRetry ? (
        <PrimaryButton label={retryLabel} onPress={onRetry} style={{ marginTop: theme.spacing.lg }} />
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
