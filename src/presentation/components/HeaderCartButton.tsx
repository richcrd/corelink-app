import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { useCartStore } from "@/src/features/store/cart.store";
import { useUiStore } from "../stores/ui.store";
import { useRouter } from "expo-router";

export function HeaderCartButton({
  onPress,
  countOverride,
  variant = "default",
}: {
  onPress?: () => void;
  countOverride?: number;
  variant?: "default" | "onPrimary";
}) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const countFromStore = useCartStore((s) => s.totalItems());
  const count = countOverride ?? countFromStore;

  function handlePress() {
    if (onPress) return onPress();
    router.push("/cart");
  }

  const isDark = colorScheme === "dark";

  const iconColor =
    variant === "onPrimary" ? (isDark ? theme.background : theme.textOnPrimary) : theme.text;

  const badgeBackgroundColor =
    variant === "onPrimary" ? (isDark ? theme.danger : theme.danger) : theme.primary;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}
    >
      <FontAwesome name="shopping-cart" size={22} color={iconColor} />
      {count > 0 ? (
        <View style={[styles.badge, { backgroundColor: badgeBackgroundColor, borderColor: theme.primary }]}>
          <Text style={[styles.badgeText, { color: theme.textOnPrimary }]}>
            {count}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 12,
    padding: 6,
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
  },
});
