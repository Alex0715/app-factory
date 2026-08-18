import Constants from 'expo-constants';
import { productConfig } from '@product-config';

/**
 * Runtime environment configuration. Reads EXPO_PUBLIC_* vars (inlined at
 * build time) and falls back to product.config.ts / app.config.ts `extra`.
 * Never put private secrets behind EXPO_PUBLIC_* - they ship inside the JS
 * bundle and are trivially extractable from the APK.
 */
export const env = {
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
    productConfig.apiBaseUrl,

  analyticsProvider: process.env.EXPO_PUBLIC_ANALYTICS_PROVIDER ?? 'console',

  isDev: __DEV__,

  appVersion: productConfig.version,
};
