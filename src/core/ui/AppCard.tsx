import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from '@core/theme';

export interface AppCardProps extends ViewProps {
  children: React.ReactNode;
}

/** Generic surface container with themed background, border and padding. */
export function AppCard({ children, style, ...rest }: AppCardProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.md,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
