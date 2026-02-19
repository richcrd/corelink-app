import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { useCartStore } from "@/src/presentation/stores/cartStore";
import { useUiStore } from "@/src/presentation/stores/uiStore";

export function HeaderCartButton({
  onPress,
  countOverride,
}: {
  onPress?: () => void;
  countOverride?: number;
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const countFromStore = useCartStore((s) => s.totalItems());
  const count = countOverride ?? countFromStore;
  const showToast = useUiStore((s) => s.showToast);

  function handlePress() {
    if (onPress) return onPress();
    showToast("Carrito próximamente", "info");
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.6 : 1 }]}
    >
      <FontAwesome name="shopping-cart" size={22} color={theme.text} />
      {count > 0 ? (
        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
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
    right: 2,
    top: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
  },
});
