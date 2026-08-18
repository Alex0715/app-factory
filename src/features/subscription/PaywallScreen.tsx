import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@core/theme';
import { AsyncContent, PaywallCard, PrimaryButton, SecondaryButton, SubscriptionOption } from '@core/ui';
import { analytics } from '@core/analytics';
import { productConfig } from '@core/config';
import { useEntitlement, usePurchase, useRestorePurchases, useSubscriptionProducts } from './useSubscription';

/**
 * Reusable paywall screen. Product-specific copy (title/benefits) is passed
 * in as props so this component stays generic; product IDs and pricing
 * come from the SubscriptionManager, configured via product.config.ts.
 */
export interface PaywallScreenProps {
  title?: string;
  benefits?: string[];
}

export function PaywallScreen({
  title = `Upgrade ${productConfig.appName}`,
  benefits = ['Unlock all features', 'Remove limits', 'Support ongoing development'],
}: PaywallScreenProps) {
  const theme = useTheme();
  const router = useRouter();
  const productsQuery = useSubscriptionProducts();
  const entitlementQuery = useEntitlement();
  const purchase = usePurchase();
  const restore = useRestorePurchases();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    analytics.trackScreen('paywall');
  }, []);

  // Derived, not effect-synced: defaults to the first plan until the user picks one.
  const effectiveProductId = selectedProductId ?? productsQuery.data?.[0]?.id ?? null;

  const isEntitled = entitlementQuery.data?.isActive ?? false;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.md }}>
      <AsyncContent
        isLoading={productsQuery.isLoading}
        error={productsQuery.error}
        data={productsQuery.data}
        onRetry={() => productsQuery.refetch()}
        emptyTitle="No plans available"
      >
        {(products) => (
          <>
            <PaywallCard title={title} benefits={benefits}>
              {isEntitled ? (
                <Text
                  style={[
                    theme.typography.bodyEmphasis,
                    { color: theme.colors.success, marginTop: theme.spacing.md, textAlign: 'center' },
                  ]}
                >
                  You&apos;re subscribed - thank you!
                </Text>
              ) : null}
            </PaywallCard>

            {!isEntitled ? (
              <>
                <Text
                  style={[
                    theme.typography.label,
                    { color: theme.colors.textSecondary, marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
                  ]}
                >
                  CHOOSE A PLAN
                </Text>
                {products.map((product) => (
                  <SubscriptionOption
                    key={product.id}
                    product={product}
                    selected={product.id === effectiveProductId}
                    onSelect={setSelectedProductId}
                    badge={product.tier === 'yearly' ? 'Best value' : undefined}
                  />
                ))}

                <PrimaryButton
                  label={purchase.isPending ? 'Processing...' : 'Continue'}
                  onPress={() => effectiveProductId && purchase.mutate(effectiveProductId)}
                  disabled={!effectiveProductId}
                  loading={purchase.isPending}
                  style={{ marginTop: theme.spacing.md }}
                />
                {purchase.error ? (
                  <Text style={[theme.typography.caption, { color: theme.colors.danger, marginTop: theme.spacing.sm }]}>
                    Purchase failed. Please try again.
                  </Text>
                ) : null}
              </>
            ) : null}

            <SecondaryButton
              label={restore.isPending ? 'Restoring...' : 'Restore purchases'}
              onPress={() => restore.mutate()}
              loading={restore.isPending}
              style={{ marginTop: theme.spacing.md }}
            />
            <SecondaryButton label="Not now" onPress={() => router.back()} style={{ marginTop: theme.spacing.sm }} />
          </>
        )}
      </AsyncContent>
    </ScrollView>
  );
}
