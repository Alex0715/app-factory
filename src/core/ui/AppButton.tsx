import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '@core/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive';

export interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
  testID?: string;
}

/** Generic themed button. Prefer PrimaryButton/SecondaryButton for common cases. */
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  accessibilityHint,
  testID,
}: AppButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'destructive'
        ? theme.colors.danger
        : 'transparent';
  const textColor = variant === 'secondary' ? theme.colors.primary : theme.colors.onPrimary;
  const borderColor = variant === 'secondary' ? theme.colors.primary : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'secondary' ? 1 : 0,
          minHeight: theme.dimensions.buttonHeight,
          borderRadius: theme.radii.md,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[theme.typography.button, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

export function PrimaryButton(props: Omit<AppButtonProps, 'variant'>) {
  return <AppButton {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<AppButtonProps, 'variant'>) {
  return <AppButton {...props} variant="secondary" />;
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
