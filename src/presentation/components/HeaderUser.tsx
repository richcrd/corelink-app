import { StyleSheet, Text, View } from "react-native";

import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { getUserDisplayName } from "@/src/features/auth/types/user";
import { useAuthStore } from "@/src/features/auth/store/auth.store";

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
