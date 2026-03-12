import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type Colors from "@/src/presentation/constants/Colors";

type Theme = typeof Colors.light;

export type QuickActionItem = {
  id: string;
  title: string;
  subtitle: string;
};

type QuickActionsRowProps = {
  actions: QuickActionItem[];
  theme: Theme;
  onPressAction: (action: QuickActionItem) => void;
};

export function QuickActionsRow({ actions, theme, onPressAction }: QuickActionsRowProps) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Explora rápido</Text>

      <FlatList
        data={actions}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onPressAction(item)}
            style={({ pressed }) => [
              styles.actionCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.86 : 1,
              },
            ]}
          >
            <Text style={[styles.actionTitle, { color: theme.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.actionSubtitle, { color: theme.tabIconDefault }]} numberOfLines={1}>
              {item.subtitle}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  row: {
    paddingRight: 16,
    gap: 10,
  },
  actionCard: {
    width: 170,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minHeight: 72,
    justifyContent: "center",
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  actionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
});
