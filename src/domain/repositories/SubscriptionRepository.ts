import { Entitlement, SubscriptionProduct } from '@domain/models';

/** Clean interface for the billing layer. See core/billing/SubscriptionManager for the implementation. */
export interface SubscriptionRepository {
  getProducts(): Promise<SubscriptionProduct[]>;
  getEntitlement(): Promise<Entitlement>;
  purchase(productId: string): Promise<Entitlement>;
  restorePurchases(): Promise<Entitlement>;
}
