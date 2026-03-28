import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type Colors from "@/src/presentation/constants/Colors";
import type { ProductDto } from "@/src/features/products";
import { Plus } from 'lucide-react-native';
import { formatCurrency } from "@/src/presentation/utils/common";

type Theme = typeof Colors.light;

type ProductsCarouselProps = {
  products: ProductDto[];
  loading: boolean;
  theme: Theme;
  onPressProduct: (item: ProductDto) => void | Promise<void>;
};

export function ProductsCarousel({
  products,
  loading,
  theme,
  onPressProduct,
}: ProductsCarouselProps) {
  return (
    <View style={[styles.section, { paddingRight: 0 }]}>
      <View style={[styles.sectionHeader, { paddingRight: 16 }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Más vendidos</Text>
      </View>

      {loading ? (
        <View style={styles.productsLoadingBox}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          horizontal
          keyExtractor={(item, index) => item.id.toString() || index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsRow}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onPressProduct(item)}
              style={[
                styles.productCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.prodImage} />
              ) : (
                <View
                  style={[
                    styles.prodImage,
                    styles.prodImagePlaceholder,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Text style={[styles.prodImagePlaceholderText, { color: theme.text }]}>Sin imagen</Text>
                </View>
              )}
              <View style={styles.prodInfo}>
                <Text style={[styles.prodName, { color: theme.text }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.prodPrice, { color: theme.text }]}>{formatCurrency(item.finalPrice)}</Text>
                <TouchableOpacity 
                  style={[styles.addIcon, { backgroundColor: theme.primary, zIndex: 10, elevation: 10 }]} 
                  onPress={() => onPressProduct(item)}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                  <Plus size={20} color={theme.card} />
                </TouchableOpacity>
              </View>
            </Pressable>
          )}
        />
      )}
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
    fontWeight: "800",
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "800",
  },
  productsRow: {
    paddingRight: 16,
    gap: 10,
  },
  productsLoadingBox: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 16,
  },
  productCard: {
    width: 140,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
  },
  prodImage: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  prodImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  prodImagePlaceholderText: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.7,
  },
  prodInfo: {
    padding: 10,
  },
  prodPrice: {
    fontSize: 12,
    fontWeight: "700",
  },
  prodName: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    minHeight: 32,
  },
  addIcon: {
    position: "absolute",
    top: 35,
    right: 10,
    borderRadius: 100,
    padding: 3,
  }
});
