import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppTopBar } from '@core/ui';
import { useTheme } from '@core/theme';
import { PaywallScreen } from '@features/subscription';

export default function Paywall() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppTopBar title="Upgrade" onBack={() => router.back()} />
      <PaywallScreen />
    </View>
  );
}
