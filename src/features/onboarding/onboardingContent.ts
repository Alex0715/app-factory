/**
 * PRODUCT CONFIGURATION: onboarding content.
 * Edit this array to customize the first-launch onboarding flow per product.
 */
export interface OnboardingSlide {
  key: string;
  title: string;
  description: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    key: 'welcome',
    title: 'Welcome',
    description: 'This is a reusable app skeleton. Replace this copy with your product’s pitch.',
  },
  {
    key: 'personalize',
    title: 'Make it yours',
    description: 'Edit product.config.ts and the theme to give this app its own identity.',
  },
  {
    key: 'ready',
    title: 'You’re all set',
    description: 'Jump in and start building your feature on top of this foundation.',
  },
];
