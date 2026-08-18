import * as secureStoreMock from 'expo-secure-store';
import { MockSubscriptionManager } from '../SubscriptionManager';

const { __reset } = secureStoreMock as unknown as { __reset: () => void };

describe('MockSubscriptionManager', () => {
  beforeEach(() => {
    __reset();
  });

  it('starts unentitled with the free tier', async () => {
    const manager = new MockSubscriptionManager();
    const entitlement = await manager.getEntitlement();
    expect(entitlement).toEqual({ tier: 'free', isActive: false });
  });

  it('lists the configured products with their tiers', async () => {
    const manager = new MockSubscriptionManager();
    const products = await manager.getProducts();
    expect(products.map((p) => p.tier)).toEqual(['monthly', 'yearly', 'lifetime']);
  });

  it('purchasing a product grants the matching entitlement and persists it', async () => {
    const manager = new MockSubscriptionManager();
    const [product] = await manager.getProducts();

    const entitlement = await manager.purchase(product.id);
    expect(entitlement).toEqual({ tier: product.tier, isActive: true });

    const reread = await manager.getEntitlement();
    expect(reread).toEqual(entitlement);
  });

  it('rejects purchasing an unknown product id', async () => {
    const manager = new MockSubscriptionManager();
    await expect(manager.purchase('not-a-real-product')).rejects.toThrow();
  });

  it('restorePurchases returns whatever entitlement is currently stored', async () => {
    const manager = new MockSubscriptionManager();
    const [product] = await manager.getProducts();
    await manager.purchase(product.id);

    const restored = await manager.restorePurchases();
    expect(restored.isActive).toBe(true);
  });

  it('hasAccess defers to the shared entitlement rules', () => {
    const manager = new MockSubscriptionManager();
    expect(manager.hasAccess('monthly', { tier: 'yearly', isActive: true })).toBe(true);
    expect(manager.hasAccess('lifetime', { tier: 'yearly', isActive: true })).toBe(false);
  });
});
