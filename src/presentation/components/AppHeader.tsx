import Feather from '@expo/vector-icons/Feather';
import { useSegments } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/src/presentation/constants/Colors';
import { useColorScheme } from '@/src/presentation/hooks/useColorScheme';
import { useUiStore } from '../stores/ui.store';
import { useAuthStore } from '@/src/features/auth/store/auth.store';
import { useCartStore } from '@/src/features/cart/store/cartStore';

import { getUserDisplayName } from '@/src/features/auth/types/user';

import { HeaderCartButton } from '@/src/presentation/components/HeaderCartButton';

export type AppHeaderProps = {
  showSearch?: boolean;
  showCart?: boolean;
  rightSlot?: ReactNode;
};

function isIndexSegment(seg: string | undefined): boolean {
  return !seg || seg === 'index';
}

export function AppHeader({ showSearch, showCart, rightSlot }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = status === 'authenticated';
  const displayName = getUserDisplayName(user);

  const cartCount = useCartStore((s) => s.totalItems());
  const showToast = useUiStore((s) => s.showToast);

  const group = segments[0];
  const route = segments[1];
  const inTabs = group === '(tabs)';

  const isHome =
    (group === '(tabs)' && isIndexSegment(route)) ||
    (group === '(public)' && isIndexSegment(route));

  const effectiveShowSearch = showSearch ?? isHome;
  const effectiveShowCart = showCart ?? isHome;

  const title = isAuthenticated ? `Hola, ${displayName}!` : "Hola";
  const subtitle = isAuthenticated
    ? '¿Buscas algo hoy?'
    : inTabs
      ? 'Inicia sesión para continuar'
      : '';

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.primary,
          paddingTop: Math.max(16, insets.top + 8),
          paddingBottom: effectiveShowSearch ? 16 : 10,
        },
      ]}
    >
      <View style={[styles.topRow, { marginBottom: effectiveShowSearch ? 12 : 0 }]}>
        <View style={styles.titleBlock}>
          <View style={[styles.avatar, { backgroundColor: theme.primaryMuted }]}>
            <Feather name="user" size={16} color={theme.text} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.textOnPrimary }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textOnPrimary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}

        {effectiveShowCart ? (
          <View style={[styles.actionPill, { backgroundColor: 'transparent' }]}>
            <HeaderCartButton variant="onPrimary" countOverride={cartCount} />
          </View>
        ) : null}
      </View>

      {effectiveShowSearch ? (
        <Pressable
          onPress={() => showToast('Búsquedas próximamente', 'info')}
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
            Buscar productos...
          </Text>
          <View style={{ flex: 1 }} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.9,
  },

  rightSlot: {
    marginRight: 10,
  },
  actionPill: {
    borderRadius: 999,
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
});
