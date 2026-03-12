import React, { useEffect } from "react";
import {
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
import { useBranchesStore } from "@/src/features/branches/store/Branches.store";
import { AdsCarousel, type AdItem } from "@/src/presentation/screens/home/components/AdsCarousel";
import {
  QuickActionsRow,
  type QuickActionItem,
} from "@/src/presentation/screens/home/components/QuickActionsRow";

const BANNER_IMAGE = require("@/assets/images/image_banner_800.webp");
const MAX_CATEGORIES = 10;
const MAX_PRODUCTS = 8;

const ADS: AdItem[] = [
  {
    id: "ad-1",
    image: BANNER_IMAGE,
  },
  {
    id: "ad-2",
    image: BANNER_IMAGE,
  },
  {
    id: "ad-3",
    image: BANNER_IMAGE,
  },
];

const QUICK_ACTIONS: QuickActionItem[] = [
  { id: "qa-1", title: "Promociones", subtitle: "Ver descuentos activos" },
  { id: "qa-2", title: "Nuevos", subtitle: "Productos recién agregados" },
  { id: "qa-3", title: "Más vendidos", subtitle: "Los favoritos del mes" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const showToast = useUiStore((s) => s.showToast);
  const selectedBranchId = useBranchesStore((s) => s.selectedBranchId);
  const carouselWidth = width - 32;
  const categoryGap = 12;
  const itemWidth = (carouselWidth - categoryGap * 3) / 4;

  const { data: products = [],
    isLoading: loadingProducts,
    error: productsError,
  } = useProducts(selectedBranchId);

  const {
    data: categories = [],
    error: categoriesError,
  } = useCategories();

  const displayedCategories = categories.slice(0, MAX_CATEGORIES);
  const displayedProducts = products.slice(0, MAX_PRODUCTS);

  useEffect(() => {
    if (productsError) {
      showToast(
        getErrorMessage(productsError, "Error cargando productos"),
        "error",
      );
    }
  }, [productsError, showToast]);

  useEffect(() => {
    if (categoriesError) {
      showToast(
        getErrorMessage(categoriesError, "Error cargando categorias"),
        "error",
      );
    }
  }, [categoriesError, showToast]);

  function onPressComingSoon() {
    showToast("Próximamente", "info");
  }

  function onPressCategory(categoryName: string) {
    showToast(`Categoría: ${categoryName}`, "info");
  }

  function onPressAd(ad: AdItem) {
    showToast('Anuncio', "info");
  }

  function onPressAction(action: QuickActionItem) {
    showToast(action.title, "info");
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
        <AdsCarousel ads={ADS} width={width} theme={theme} onPressAd={onPressAd} />

        <QuickActionsRow
          actions={QUICK_ACTIONS}
          theme={theme}
          onPressAction={onPressAction}
        />

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

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
