import { Stack } from 'expo-router';

import { AppHeader } from '@/src/presentation/components/AppHeader';

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <AppHeader />,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
