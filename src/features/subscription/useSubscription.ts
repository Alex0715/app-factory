import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionManager } from '@core/billing';
import { analytics } from '@core/analytics';

const PRODUCTS_KEY = ['subscription', 'products'];
const ENTITLEMENT_KEY = ['subscription', 'entitlement'];

/** Feature-level hook wrapping the SubscriptionManager with TanStack Query caching. */
export function useSubscriptionProducts() {
  return useQuery({ queryKey: PRODUCTS_KEY, queryFn: () => subscriptionManager.getProducts() });
}

export function useEntitlement() {
  return useQuery({ queryKey: ENTITLEMENT_KEY, queryFn: () => subscriptionManager.getEntitlement() });
}

export function usePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => subscriptionManager.purchase(productId),
    onSuccess: (entitlement) => {
      analytics.trackSubscription(entitlement.tier, 'started');
      queryClient.setQueryData(ENTITLEMENT_KEY, entitlement);
    },
  });
}

export function useRestorePurchases() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => subscriptionManager.restorePurchases(),
    onSuccess: (entitlement) => {
      analytics.trackSubscription(entitlement.tier, 'restored');
      queryClient.setQueryData(ENTITLEMENT_KEY, entitlement);
    },
  });
}
