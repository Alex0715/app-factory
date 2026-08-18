import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';

export interface AppTopBarProps {
  title: string;
  onBack?: () => void;
  rightAction?: { label: string; onPress: () => void };
}

/** Generic top app bar with optional back button and a single right-side action. */
export function AppTopBar({ title, onBack, rightAction }: AppTopBarProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          height: theme.dimensions.topBarHeight,
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            style={{ minWidth: theme.dimensions.minTouchTarget, minHeight: theme.dimensions.minTouchTarget }}
          >
            <Text style={[theme.typography.bodyEmphasis, { color: theme.colors.primary }]}>Back</Text>
          </Pressable>
        ) : null}
      </View>
      <Text
        style={[theme.typography.subtitle, { color: theme.colors.textPrimary }]}
        numberOfLines={1}
        accessibilityRole="header"
      >
        {title}
      </Text>
      <View style={[styles.side, styles.rightSide]}>
        {rightAction ? (
          <Pressable
            onPress={rightAction.onPress}
            accessibilityRole="button"
            accessibilityLabel={rightAction.label}
            hitSlop={12}
            style={{ minWidth: theme.dimensions.minTouchTarget, minHeight: theme.dimensions.minTouchTarget }}
          >
            <Text style={[theme.typography.bodyEmphasis, { color: theme.colors.primary, textAlign: 'right' }]}>
              {rightAction.label}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  side: {
    minWidth: 56,
  },
  rightSide: {
    alignItems: 'flex-end',
  },
});
