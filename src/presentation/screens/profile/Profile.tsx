import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/src/presentation/constants/Colors';
import { useColorScheme } from '@/src/presentation/hooks/useColorScheme';
import { useAuthStore } from '@/src/features/auth/store/auth.store';
import { useUiStore } from '@/src/presentation/stores/ui.store';
import { getUserDisplayName } from '@/src/features/auth/types/user';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const status = useAuthStore((s) => s.status);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const showToast = useUiStore((s) => s.showToast);

  const isAuthenticated = status === 'authenticated';
  const displayName = getUserDisplayName(user);

  async function onPressAuthAction() {
    if (isAuthenticated) {
      await logout();
      showToast('Signed out', 'info');
      router.replace('/(tabs)');
      return;
    }

    router.push('/(public)/login');
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Profile</Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.tabIconDefault }]}>Account</Text>
        <Text style={[styles.value, { color: theme.text }]} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={[styles.meta, { color: theme.tabIconDefault }]}>
          {isAuthenticated ? 'Signed in' : 'Guest'}
        </Text>

        <Pressable
          onPress={onPressAuthAction}
          style={({ pressed }) => [
            styles.authButton,
            {
              backgroundColor: theme.primary,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[styles.authButtonText, { color: theme.textOnPrimary }]}
          >
            {isAuthenticated ? 'Sign out' : 'Sign in'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },

  card: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '900',
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
  },

  authButton: {
    marginTop: 12,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
});
