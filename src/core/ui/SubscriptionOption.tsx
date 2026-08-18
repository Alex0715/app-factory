import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';
import { SubscriptionProduct } from '@domain/models';

export interface SubscriptionOptionProps {
  product: SubscriptionProduct;
  selected: boolean;
  onSelect: (productId: string) => void;
  badge?: string;
}

/** Single selectable plan row used inside PaywallCard / PaywallScreen. */
export function SubscriptionOption({ product, selected, onSelect, badge }: SubscriptionOptionProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => onSelect(product.id)}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${product.title}, ${product.priceLabel}`}
      style={[
        styles.container,
        {
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
          borderRadius: theme.radii.md,
          padding: theme.spacing.md,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.textColumn}>
        <View style={styles.titleRow}>
          <Text style={[theme.typography.bodyEmphasis, { color: theme.colors.textPrimary }]}>{product.title}</Text>
          {badge ? (
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.primary, borderRadius: theme.radii.pill, marginLeft: theme.spacing.sm },
              ]}
            >
              <Text style={[theme.typography.caption, { color: theme.colors.onPrimary }]}>{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
          {product.description}
        </Text>
      </View>
      <Text style={[theme.typography.subtitle, { color: theme.colors.textPrimary }]}>{product.priceLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  textColumn: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
