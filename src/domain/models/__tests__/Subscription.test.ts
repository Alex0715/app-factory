import { Entitlement, isEntitled } from '../Subscription';

function entitlement(overrides: Partial<Entitlement>): Entitlement {
  return { tier: 'free', isActive: false, ...overrides };
}

describe('isEntitled', () => {
  it('denies access when the entitlement is inactive', () => {
    expect(isEntitled(entitlement({ tier: 'lifetime', isActive: false }), 'monthly')).toBe(false);
  });

  it('denies access for the free tier even if marked active', () => {
    expect(isEntitled(entitlement({ tier: 'free', isActive: true }), 'monthly')).toBe(false);
  });

  it('monthly requirement is satisfied by monthly, yearly, or lifetime', () => {
    expect(isEntitled(entitlement({ tier: 'monthly', isActive: true }), 'monthly')).toBe(true);
    expect(isEntitled(entitlement({ tier: 'yearly', isActive: true }), 'monthly')).toBe(true);
    expect(isEntitled(entitlement({ tier: 'lifetime', isActive: true }), 'monthly')).toBe(true);
  });

  it('yearly requirement is NOT satisfied by monthly', () => {
    expect(isEntitled(entitlement({ tier: 'monthly', isActive: true }), 'yearly')).toBe(false);
    expect(isEntitled(entitlement({ tier: 'yearly', isActive: true }), 'yearly')).toBe(true);
    expect(isEntitled(entitlement({ tier: 'lifetime', isActive: true }), 'yearly')).toBe(true);
  });

  it('lifetime requirement is satisfied only by lifetime', () => {
    expect(isEntitled(entitlement({ tier: 'yearly', isActive: true }), 'lifetime')).toBe(false);
    expect(isEntitled(entitlement({ tier: 'lifetime', isActive: true }), 'lifetime')).toBe(true);
  });
});
