import Feather from '@expo/vector-icons/Feather';
import { useRouter, useSegments } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/src/presentation/constants/Colors';
import { useColorScheme } from '@/src/presentation/hooks/useColorScheme';
import { useUiStore } from '@/src/presentation/stores/uiStore';
import { useAuthStore } from '@/src/presentation/stores/authStore';
import { useCartStore } from '@/src/presentation/stores/cartStore';

import { getUserDisplayName } from '@/src/domain/entities/User';

import { HeaderCartButton } from '@/src/presentation/components/HeaderCartButton';

export type AppHeaderProps = {
  showSearch?: boolean;
  showCart?: boolean;
};

function isIndexSegment(seg: string | undefined): boolean {
  return !seg || seg === 'index';
}

export function AppHeader({ showSearch, showCart }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const status = useAuthStore((s) => s.status);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = status === 'authenticated';
  const displayName = getUserDisplayName(user);

  const cartCount = useCartStore((s) => s.totalItems());
  const showToast = useUiStore((s) => s.showToast);

  const group = segments[0];
  const route = segments[1];

  const isHome =
    (group === '(tabs)' && isIndexSegment(route)) ||
    (group === '(public)' && isIndexSegment(route));

  const isAuthScreen = group === '(public)' && (route === 'login' || route === 'register');

  const effectiveShowSearch = showSearch ?? isHome;
  const effectiveShowCart = showCart ?? false;

  async function onPressAuthAction() {
    if (isAuthenticated) {
      await logout();
      showToast('Sesión cerrada', 'info');
      router.replace('/(public)');
      return;
    }

    if (!isAuthScreen) {
      router.push('/(public)/login');
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.primary, paddingTop: Math.max(16, insets.top + 8) }]}
    >
      <View style={styles.locationRow}>
        <Feather name="user" size={16} color={theme.textOnPrimary} />
        <Text style={[styles.locationText, { color: theme.textOnPrimary }]} numberOfLines={1}>
          {displayName}
        </Text>
        <View style={{ flex: 1 }} />
      </View>

      {effectiveShowSearch ? (
        <Pressable
          onPress={() => showToast('Búsqueda próximamente', 'info')}
          style={({ pressed }) => [
            styles.searchContainer,
            {
              backgroundColor: theme.card,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Feather name="search" size={18} color={theme.tabIconDefault} />
          <Text style={[styles.searchPlaceholder, { color: theme.tabIconDefault }]}>
            Buscar frutas, verduras, carnes...
          </Text>
          <View style={{ flex: 1 }} />

          {effectiveShowCart ? (
            <HeaderCartButton countOverride={cartCount} />
          ) : null}

          {!isAuthScreen ? (
            <Pressable
              onPress={onPressAuthAction}
              hitSlop={8}
              style={({ pressed }) => [
                styles.authPill,
                {
                  backgroundColor: theme.primaryMuted,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.authPillText, { color: theme.text }]}>
                {isAuthenticated ? 'Salir' : 'Entrar'}
              </Text>
            </Pressable>
          ) : null}
        </Pressable>
      ) : (
        <View style={styles.actionsRow}>
          <View style={{ flex: 1 }} />
          {effectiveShowCart ? (
            <HeaderCartButton countOverride={cartCount} />
          ) : null}
          {!isAuthScreen ? (
            <Pressable
              onPress={onPressAuthAction}
              hitSlop={8}
              style={({ pressed }) => [
                styles.authPill,
                {
                  backgroundColor: theme.primaryMuted,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.authPillText, { color: theme.text }]}>
                {isAuthenticated ? 'Salir' : 'Entrar'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },

  searchContainer: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontWeight: '600',
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  authPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  authPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
