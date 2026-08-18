import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@features/onboarding';

export default function Onboarding() {
  const router = useRouter();
  return <OnboardingScreen onComplete={() => router.replace('/(tabs)/home')} />;
}
