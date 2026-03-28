import { Stack } from 'expo-router';
import { Colors } from '../constants/colors';

export default function Layout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: Colors.background,
      },
      headerTintColor: Colors.text,
      contentStyle: {
        backgroundColor: Colors.background,
      }
    }}>
      <Stack.Screen name="index" options={{ title: 'REDFLAGS', headerShown: false }} />
      <Stack.Screen name="capture/live-input" options={{ title: 'Capture Signal', presentation: 'modal' }} />
      <Stack.Screen name="paywall/core" options={{ title: 'Core', presentation: 'fullScreenModal' }} />
      <Stack.Screen name="paywall/pro" options={{ title: 'Pro', presentation: 'fullScreenModal' }} />
      <Stack.Screen name="reports/index" options={{ title: 'Intelligence' }} />
      <Stack.Screen name="reports/psychology-read" options={{ title: 'Psychology Read' }} />
    </Stack>
  );
}
