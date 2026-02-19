import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/src/presentation/constants/Colors';
import { useColorScheme } from '@/src/presentation/hooks/useColorScheme';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Esta pantalla no existe.</Text>

        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: theme.primary }]}>Volver al inicio</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
