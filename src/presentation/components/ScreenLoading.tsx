import React from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import Colors from "@/src/presentation/constants/Colors";
import { useLoadingStore } from "../stores/loading.store";

export default function ScreenLoading() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const loading = useLoadingStore((s) => s.loading);

  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 999,
  },
});
