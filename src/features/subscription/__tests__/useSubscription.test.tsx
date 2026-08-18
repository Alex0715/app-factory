import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as secureStoreMock from 'expo-secure-store';
import { useEntitlement, usePurchase, useSubscriptionProducts } from '../useSubscription';

const { __reset } = secureStoreMock as unknown as { __reset: () => void };

// gcTime: 0 so query caches (and their internal GC timers) are torn down
// immediately instead of lingering past the end of the test process.
function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('subscription hooks', () => {
  beforeEach(() => {
    __reset();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('useSubscriptionProducts loads the configured plans', async () => {
    const { result } = renderHook(() => useSubscriptionProducts(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.length).toBe(3);
  });

  it('useEntitlement starts on the free tier', async () => {
    const { result } = renderHook(() => useEntitlement(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ tier: 'free', isActive: false });
  });

  it('usePurchase transitions to a paid entitlement', async () => {
    const { result: productsResult } = renderHook(() => useSubscriptionProducts(), { wrapper });
    await waitFor(() => expect(productsResult.current.isSuccess).toBe(true));
    const [product] = productsResult.current.data!;

    const { result: purchaseResult } = renderHook(() => usePurchase(), { wrapper });

    await act(async () => {
      await purchaseResult.current.mutateAsync(product.id);
    });

    expect(purchaseResult.current.data).toEqual({ tier: product.tier, isActive: true });
  });
});
