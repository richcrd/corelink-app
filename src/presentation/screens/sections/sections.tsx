import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/src/presentation/constants/Colors';
import { useColorScheme } from '@/src/presentation/hooks/useColorScheme';

export default function SectionsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Aisles</Text>
      <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>Coming soon</Text>
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
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
  },
});
