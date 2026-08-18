/**
 * Analytics abstraction. The rest of the app depends only on this
 * interface, never on a concrete provider (Firebase, PostHog, Amplitude...).
 * Swap `analytics` (see index.ts) to change providers app-wide.
 */
export interface AnalyticsTracker {
  trackScreen(screenName: string, params?: Record<string, unknown>): void;
  trackEvent(eventName: string, params?: Record<string, unknown>): void;
  trackPurchase(productId: string, priceUsd: number, params?: Record<string, unknown>): void;
  trackSubscription(
    productId: string,
    action: 'started' | 'renewed' | 'cancelled' | 'restored',
    params?: Record<string, unknown>
  ): void;
  trackOnboardingCompleted(params?: Record<string, unknown>): void;
  trackFeatureUsed(featureName: string, params?: Record<string, unknown>): void;
  setUserId(userId: string | null): void;
}

/** No-op implementation - safe default for local development and tests. */
export class NoopAnalyticsTracker implements AnalyticsTracker {
  trackScreen(): void {}
  trackEvent(): void {}
  trackPurchase(): void {}
  trackSubscription(): void {}
  trackOnboardingCompleted(): void {}
  trackFeatureUsed(): void {}
  setUserId(): void {}
}

/** Logs to the console. Useful for local development to see events fire. */
export class ConsoleAnalyticsTracker implements AnalyticsTracker {
  private log(event: string, params?: Record<string, unknown>) {
    console.log(`[analytics] ${event}`, params ?? {});
  }

  trackScreen(screenName: string, params?: Record<string, unknown>): void {
    this.log(`screen_view:${screenName}`, params);
  }

  trackEvent(eventName: string, params?: Record<string, unknown>): void {
    this.log(eventName, params);
  }

  trackPurchase(productId: string, priceUsd: number, params?: Record<string, unknown>): void {
    this.log('purchase', { productId, priceUsd, ...params });
  }

  trackSubscription(
    productId: string,
    action: 'started' | 'renewed' | 'cancelled' | 'restored',
    params?: Record<string, unknown>
  ): void {
    this.log(`subscription_${action}`, { productId, ...params });
  }

  trackOnboardingCompleted(params?: Record<string, unknown>): void {
    this.log('onboarding_completed', params);
  }

  trackFeatureUsed(featureName: string, params?: Record<string, unknown>): void {
    this.log('feature_used', { featureName, ...params });
  }

  setUserId(userId: string | null): void {
    this.log('set_user_id', { userId });
  }
}
