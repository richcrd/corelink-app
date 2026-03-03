import React, { useEffect } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { useUiStore } from "../../stores/ui.store";
import { useCategories } from "@/src/features/categories/hooks/useCategories";
import { useProducts } from "@/src/features/products/hooks/useProducts";
import { getErrorMessage } from "@/src/presentation/feedback/getErrorMessage";
import { CategoriesCarousel } from "./components/CategoriesCarousel";
import { ProductsCarousel } from "./components/ProductsCarousel";
import { OccasionSection } from "./components/OccasionSection";

const BANNER_IMAGE = require("@/assets/images/main_banner.jpg");
const branchId = "5581bff3-7fb7-49c8-b193-420b2066b7db";
const MAX_CATEGORIES = 10;
const MAX_PRODUCTS = 8;
const OCCASIONS = [
  "Desayuno",
  "Almuerzo",
  "Cena",
  "Snacks",
  "Oficina",
  "Fin de semana",
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const showToast = useUiStore((s) => s.showToast);
  const carouselWidth = width - 32;
  const categoryGap = 12;
  const itemWidth = (carouselWidth - categoryGap * 3) / 4;

  const { data: products = [], 
    isLoading: loadingProducts,
    error: productsError,
  } = useProducts(branchId);

  const { data: categories = [],
    error: categoriesError,
  } = useCategories();

  const displayedCategories = categories.slice(0, MAX_CATEGORIES);
  const displayedProducts = products.slice(0, MAX_PRODUCTS);

  useEffect(() => {
    if (productsError) {
      showToast(getErrorMessage(productsError, "Error cargando productos"), "error");
    }
  }, [productsError]);

  useEffect(() => {
    if (categoriesError) {
      showToast(getErrorMessage(categoriesError, "Error cargando categorias"), "error");
    }
  }, [categoriesError]);

  function onPressComingSoon() {
    showToast("Próximamente", "info");
  }

  function onPressCategory(categoryName: string) {
    showToast(`Categoría: ${categoryName}`, "info");
  }

  function onPressOccasion(occasion: string) {
    showToast(`Ocasión: ${occasion}`, "info");
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
      >
        <View style={styles.bannerSection}>
          <ImageBackground
            source={BANNER_IMAGE}
            style={[styles.bannerCard, { backgroundColor: theme.card }]}
            imageStyle={styles.bannerImage}
          />
        </View>

        <CategoriesCarousel
          categories={displayedCategories}
          theme={theme}
          itemWidth={itemWidth}
          categoryGap={categoryGap}
          onPressCategory={onPressCategory}
          onPressSeeAll={onPressComingSoon}
        />

        <ProductsCarousel
          products={displayedProducts}
          loading={loadingProducts}
          theme={theme}
          onPressProduct={onPressComingSoon}
        />

        <OccasionSection
          occasions={OCCASIONS}
          theme={theme}
          onPressOccasion={onPressOccasion}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  bannerSection: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  bannerCard: {
    height: 160,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
});
