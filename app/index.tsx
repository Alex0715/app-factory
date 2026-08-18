import { Redirect } from 'expo-router';
import { usePreferencesStore } from '@core/storage/preferencesStore';

/** Entry route: sends first-time users to onboarding, everyone else to the main tabs. */
export default function Index() {
  const onboardingCompleted = usePreferencesStore((s) => s.onboardingCompleted);
  return <Redirect href={onboardingCompleted ? '/(tabs)/home' : '/onboarding'} />;
}
