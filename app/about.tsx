import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppTopBar } from '@core/ui';
import { useTheme } from '@core/theme';
import { AboutScreen } from '@features/about';

export default function About() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppTopBar title="About" onBack={() => router.back()} />
      <AboutScreen />
    </View>
  );
}
