import React from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import type Colors from "@/src/presentation/constants/Colors";
import type { ProductCategoryDto } from "@/src/features/categories/types/Category";

type Theme = typeof Colors.light;

type CategoriesCarouselProps = {
  categories: ProductCategoryDto[];
  theme: Theme;
  itemWidth: number;
  categoryGap: number;
  onPressSeeAll: () => void;
  onPressCategory: (categoryName: string) => void;
};

export function CategoriesCarousel({
  categories,
  theme,
  itemWidth,
  categoryGap,
  onPressSeeAll,
  onPressCategory,
}: CategoriesCarouselProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Categorías</Text>
        <Pressable onPress={onPressSeeAll}>
          <Text style={[styles.seeAll, { color: theme.primary }]}>Ver todas</Text>
        </Pressable>
      </View>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(c) => c.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + categoryGap}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingRight: categoryGap }}
        renderItem={({ item, index }) => {
          const isLast = index === categories.length - 1;
          return (
            <Pressable
              onPress={() => onPressCategory(item.name)}
              style={({ pressed }) => [
                styles.categoryItem,
                {
                  opacity: pressed ? 0.85 : 1,
                  width: itemWidth,
                  marginRight: isLast ? 0 : categoryGap,
                },
              ]}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.catImage} />
              <Text
                style={[styles.catLabel, { color: theme.text, width: itemWidth }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "800",
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  catImage: {
    width: 64,
    height: 64,
    resizeMode: "cover",
    borderRadius: 999,
  },
  catLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.9,
    textAlign: "center",
  },
});
