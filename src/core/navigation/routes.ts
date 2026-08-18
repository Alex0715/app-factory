/**
 * Centralized route table. Screens/components should navigate via these
 * constants (`router.push(routes.settings)`) instead of hardcoding path
 * strings throughout the app - keeps navigation logic out of composables
 * and makes renaming a route a one-line change.
 */
export const routes = {
  onboarding: '/onboarding' as const,
  home: '/(tabs)/home' as const,
  settings: '/(tabs)/settings' as const,
  about: '/about' as const,
  privacy: '/privacy' as const,
  feedback: '/feedback' as const,
  paywall: '/paywall' as const,
};

export type AppRoute = (typeof routes)[keyof typeof routes];
