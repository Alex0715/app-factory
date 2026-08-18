import { featureFlags } from '../featureFlags';

describe('featureFlags', () => {
  afterEach(() => {
    featureFlags.clearOverride('subscriptionsEnabled');
    featureFlags.clearOverride('someUnknownFlag');
  });

  it('falls back to the product.config.ts default when there is no override', () => {
    expect(featureFlags.isEnabled('subscriptionsEnabled')).toBe(true);
  });

  it('returns false for an unknown flag with no default', () => {
    expect(featureFlags.isEnabled('someUnknownFlag')).toBe(false);
  });

  it('an override takes precedence over the default', () => {
    featureFlags.setOverride('subscriptionsEnabled', false);
    expect(featureFlags.isEnabled('subscriptionsEnabled')).toBe(false);
  });

  it('clearing an override restores the default', () => {
    featureFlags.setOverride('subscriptionsEnabled', false);
    featureFlags.clearOverride('subscriptionsEnabled');
    expect(featureFlags.isEnabled('subscriptionsEnabled')).toBe(true);
  });
});
