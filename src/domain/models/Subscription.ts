export type SubscriptionTier = 'free' | 'monthly' | 'yearly' | 'lifetime';

export interface SubscriptionProduct {
  id: string;
  tier: SubscriptionTier;
  title: string;
  description: string;
  /** Formatted, store-localized price string, e.g. "$4.99". Populated at runtime by the store. */
  priceLabel: string;
}

export interface Entitlement {
  tier: SubscriptionTier;
  isActive: boolean;
  /** ISO date string, undefined for lifetime / free. */
  expiresAt?: string;
}

export function isEntitled(entitlement: Entitlement, requiredTier: Exclude<SubscriptionTier, 'free'>): boolean {
  if (!entitlement.isActive) return false;
  if (entitlement.tier === 'free') return false;
  if (requiredTier === 'monthly') {
    return ['monthly', 'yearly', 'lifetime'].includes(entitlement.tier);
  }
  if (requiredTier === 'yearly') {
    return ['yearly', 'lifetime'].includes(entitlement.tier);
  }
  return entitlement.tier === 'lifetime';
}
