import { StyleSheet, Text, View } from "react-native";

import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { getUserDisplayName } from "@/src/domain/entities/User";
import { useAuthStore } from "@/src/presentation/stores/authStore";

export function HeaderUser() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const user = useAuthStore((s) => s.user);
  const name = getUserDisplayName(user);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: theme.text }]} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 12,
    maxWidth: 160,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
