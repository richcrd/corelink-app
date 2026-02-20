import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/presentation/hooks/useColorScheme';
import { ToastViewport } from '@/src/presentation/feedback/ToastViewport';
import { useAuthStore } from '@/src/features/auth/store/auth.store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (loaded && hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, hasHydrated]);

  if (!loaded || !hasHydrated) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthRedirect />
          <Stack screenOptions={{ headerShown: false }}>
          </Stack>
          <ToastViewport />
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

function AuthRedirect() {
  const router = useRouter();
  const segments = useSegments();
  const status = useAuthStore((s) => s.status);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const protectedTabs = new Set<string>([
    // 'profile'
  ]);

  useEffect(() => {
    if (!hasHydrated) return;
    const group = segments[0];
    const route = segments[1];

    const inPublicGroup = group === '(public)';
    const inTabsGroup = group === '(tabs)';
    const isAuthScreen = inPublicGroup && (route === 'login' || route === 'register');

    if (status === 'authenticated' && inPublicGroup) {
      router.replace('/(tabs)');
      return;
    }

    if (status !== 'authenticated' && inPublicGroup && !isAuthScreen) {
      router.replace('/(tabs)');
      return;
    }

    if (status !== 'authenticated' && inTabsGroup) {
      const tabRoute = route ?? 'index';
      if (protectedTabs.has(tabRoute)) {
        router.replace('/(public)/login');
      }
    }
  }, [hasHydrated, router, segments, status]);

  return null;
}
