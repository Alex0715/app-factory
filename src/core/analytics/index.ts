import { env } from '@core/config/env';
import { AnalyticsTracker, ConsoleAnalyticsTracker, NoopAnalyticsTracker } from './AnalyticsTracker';

export * from './AnalyticsTracker';

/**
 * The active analytics implementation. To wire up a real provider (Firebase
 * Analytics, PostHog, Amplitude, ...), implement `AnalyticsTracker` in a new
 * file here and swap the instance below - no other code changes needed.
 */
export const analytics: AnalyticsTracker =
  env.analyticsProvider === 'console' || env.isDev ? new ConsoleAnalyticsTracker() : new NoopAnalyticsTracker();
