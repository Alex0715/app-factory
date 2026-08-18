/**
 * PRODUCT CONFIGURATION
 * =====================
 * This is the SINGLE file most new apps built from this template need to edit
 * to rebrand the skeleton into a new product. See APP_FACTORY.md for the full
 * clone checklist (this file + app.json + assets + theme colors + env vars).
 *
 * Everything here is read by app.config.ts (which generates the Expo config)
 * and by src/core/config so the same values are available at runtime.
 */

export const productConfig = {
  /** Human-readable app name shown on the home screen / app stores. */
  appName: 'App Factory',

  /** Short name used where space is limited (e.g. Android launcher label). */
  shortName: 'AppFactory',

  /** Reverse-DNS Android application id / iOS bundle identifier. Change per app. */
  applicationId: 'com.appfactory.base',

  /** Expo project "slug" - used for EAS builds and URLs. */
  slug: 'app-factory-base',

  /** Deep link / universal link scheme, e.g. "appfactory://" */
  scheme: 'appfactory',

  /** Semantic version shown to users. */
  version: '1.0.0',

  /** One-line description used in store metadata. */
  description: 'A reusable Expo + React Native app factory skeleton.',

  /** Support / feedback contact email shown on the Feedback screen. */
  supportEmail: 'support@example.com',

  /** Public marketing / privacy policy URLs. Replace per product. */
  urls: {
    privacyPolicy: 'https://example.com/privacy',
    termsOfService: 'https://example.com/terms',
    website: 'https://example.com',
  },

  /** Base URL for the product's backend API. Overridable via EXPO_PUBLIC_API_BASE_URL. */
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.example.com',

  /** In-app purchase / subscription product identifiers (App Store Connect / Play Console). */
  subscriptionProductIds: {
    monthly: 'app_factory_monthly',
    yearly: 'app_factory_yearly',
    lifetime: 'app_factory_lifetime',
  },

  /** Default feature flags. Override per product; see src/core/featureFlags. */
  featureFlags: {
    subscriptionsEnabled: true,
    feedbackEnabled: true,
    debugMenuEnabled: process.env.NODE_ENV !== 'production',
  },
} as const;

export type ProductConfig = typeof productConfig;
