import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@core/theme';
import { AppCard } from './AppCard';

export interface PaywallCardProps {
  title: string;
  benefits: string[];
  children?: React.ReactNode;
}

/** Card summarizing plan benefits at the top of a PaywallScreen. Product-specific copy is passed in as props. */
export function PaywallCard({ title, benefits, children }: PaywallCardProps) {
  const theme = useTheme();
  return (
    <AppCard>
      <Text style={[theme.typography.title, { color: theme.colors.textPrimary, textAlign: 'center' }]}>{title}</Text>
      <View style={{ marginTop: theme.spacing.md }}>
        {benefits.map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <Text style={{ color: theme.colors.success, marginRight: 8 }} accessibilityElementsHidden>
              {'✓'}
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.textPrimary, flex: 1 }]}>{benefit}</Text>
          </View>
        ))}
      </View>
      {children}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
});
