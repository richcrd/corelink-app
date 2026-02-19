import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { useUiStore } from "@/src/presentation/stores/uiStore";

export function ToastViewport() {
  const { toast } = useUiStore();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const background =
    toast.type === "success"
      ? theme.success
      : toast.type === "error"
        ? theme.danger
        : theme.card;

  useEffect(() => {
    // No-op: keeps component reactive.
  }, [toast.visible, toast.message, toast.type]);

  if (!toast.visible) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.container, { paddingBottom: insets.bottom + 12 }]}
    >
      <View style={[styles.toast, { backgroundColor: background }]}>
        <Text
          style={[styles.text, { color: theme.textOnPrimary }]}
          numberOfLines={2}
        >
          {toast.message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 9999,
  },
  toast: {
    maxWidth: 520,
    width: "92%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
