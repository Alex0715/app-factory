import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppTopBar } from '@core/ui';
import { useTheme } from '@core/theme';
import { PrivacyScreen } from '@features/about';

export default function Privacy() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppTopBar title="Privacy" onBack={() => router.back()} />
      <PrivacyScreen />
    </View>
  );
}
