import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { useUiStore } from "@/src/presentation/stores/uiStore";

export function ToastViewport() {
  const toast = useUiStore((s) => s.toast);
  const { bottom } = useSafeAreaInsets();
  const theme = Colors[useColorScheme() ?? "light"];

  if (!toast.visible) return null;

  const backgroundMap = {
    success: theme.success,
    error: theme.danger,
    info: theme.card,
  };

  return (
    <View
      pointerEvents="none"
      style={[styles.container, { paddingBottom: bottom + 12 }]}
    >
      <View
        style={[
          styles.toast,
          { backgroundColor: backgroundMap[toast.type] },
        ]}
      >
        <Text style={[styles.text, { color: theme.textOnPrimary }]}>
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
