import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type Colors from "@/src/presentation/constants/Colors";

type Theme = typeof Colors.light;

type OccasionSectionProps = {
  occasions: string[];
  theme: Theme;
  onPressOccasion: (occasion: string) => void;
};

export function OccasionSection({
  occasions,
  theme,
  onPressOccasion,
}: OccasionSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Por ocasión</Text>

      <FlatList
        data={occasions}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onPressOccasion(item)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: '#6594B1',
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: theme.card }]}>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 18,
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
  chip: {
    height: 40,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
