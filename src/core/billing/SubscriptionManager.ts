import { Entitlement, isEntitled, SubscriptionProduct, SubscriptionTier } from '@domain/models';
import { SubscriptionRepository } from '@domain/repositories';
import { productConfig } from '@core/config';
import { secureStorage, SecureStorageKeys } from '@core/storage/secureStorage';
import { AppError } from '@core/errors';

/**
 * Billing abstraction. The product-specific app only needs to:
 *   1. Set product IDs in product.config.ts.
 *   2. Provide a real `SubscriptionRepository` implementation (react-native-iap
 *      / expo-in-app-purchases wired to Google Play Billing) via an EAS
 *      development/production build - IAP does not work in Expo Go.
 *
 * `MockSubscriptionManager` below is a local, store-free implementation
 * useful for UI development and tests: it "purchases" instantly and
 * persists the resulting entitlement to secure storage.
 */
export interface SubscriptionManager extends SubscriptionRepository {
  hasAccess(requiredTier: Exclude<SubscriptionTier, 'free'>, entitlement: Entitlement): boolean;
}

const FREE_ENTITLEMENT: Entitlement = { tier: 'free', isActive: false };

export class MockSubscriptionManager implements SubscriptionManager {
  async getProducts(): Promise<SubscriptionProduct[]> {
    return [
      {
        id: productConfig.subscriptionProductIds.monthly,
        tier: 'monthly',
        title: 'Monthly',
        description: 'Billed every month, cancel anytime.',
        priceLabel: '$4.99/mo',
      },
      {
        id: productConfig.subscriptionProductIds.yearly,
        tier: 'yearly',
        title: 'Yearly',
        description: 'Billed once a year. Best value.',
        priceLabel: '$39.99/yr',
      },
      {
        id: productConfig.subscriptionProductIds.lifetime,
        tier: 'lifetime',
        title: 'Lifetime',
        description: 'One-time purchase, yours forever.',
        priceLabel: '$99.99',
      },
    ];
  }

  async getEntitlement(): Promise<Entitlement> {
    try {
      const raw = await secureStorage.getItem(SecureStorageKeys.purchaseReceipt);
      if (!raw) return FREE_ENTITLEMENT;
      return JSON.parse(raw) as Entitlement;
    } catch {
      return FREE_ENTITLEMENT;
    }
  }

  async purchase(productId: string): Promise<Entitlement> {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) {
      throw AppError.validation('That subscription option is not available.');
    }
    const entitlement: Entitlement = { tier: product.tier, isActive: true };
    await secureStorage.setItem(SecureStorageKeys.purchaseReceipt, JSON.stringify(entitlement));
    return entitlement;
  }

  async restorePurchases(): Promise<Entitlement> {
    return this.getEntitlement();
  }

  hasAccess(requiredTier: Exclude<SubscriptionTier, 'free'>, entitlement: Entitlement): boolean {
    return isEntitled(entitlement, requiredTier);
  }
}

export const subscriptionManager: SubscriptionManager = new MockSubscriptionManager();
