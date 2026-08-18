import type { ExpoConfig, ConfigContext } from 'expo/config';
// Expo's config loader does not resolve extensionless local imports from
// app.config.ts, so the .ts suffix is required here only.
import { productConfig } from './product.config.ts';


/**
 * Dynamic Expo config. Values are sourced from product.config.ts so that a
 * new app only needs to edit that one file (plus assets) to rebrand.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: productConfig.appName,
  slug: productConfig.slug,
  scheme: productConfig.scheme,
  version: productConfig.version,
  description: productConfig.description,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: productConfig.applicationId,
  },
  android: {
    package: productConfig.applicationId,
    adaptiveIcon: {
      backgroundColor: '#171717',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-sqlite',
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#171717',
      },
    ],
  ],
  extra: {
    apiBaseUrl: productConfig.apiBaseUrl,
    eas: {
      // Replace with a real EAS project id after running `eas init`.
      projectId: process.env.EAS_PROJECT_ID ?? '00000000-0000-0000-0000-000000000000',
    },
  },
});
