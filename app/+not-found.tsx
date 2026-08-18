import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '@core/theme';
import { EmptyView } from '@core/ui';

export default function NotFound() {
  const theme = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <EmptyView title="Page not found" message="The screen you're looking for doesn't exist." />
        <Link href="/" style={{ textAlign: 'center', color: theme.colors.primary, marginBottom: theme.spacing.lg }}>
          Go to home
        </Link>
      </View>
    </>
  );
}
