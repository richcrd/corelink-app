import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, Pressable, TouchableOpacity, Dimensions } from "react-native";
import React, { useMemo } from "react";
import { useProductsByCategory } from "@/src/features/products/hooks/useProductsByCategory";
import { useBranchesStore } from "@/src/features/branches/store/Branches.store";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import Colors from "@/src/presentation/constants/Colors";
import { formatCurrency } from "@/src/presentation/utils/common";
import { Plus } from "lucide-react-native";
import { ProductDto } from "@/src/features/products/types/Product";
import { useCartMutations } from "@/src/features/cart/hooks/useCartMutations";
import { useUiStore } from "@/src/presentation/stores/ui.store";
import { getErrorMessage } from "@/src/presentation/feedback/ToastViewport";

interface ProductsViewProps {
  categoryId?: string;
}

const numColumns = 3;
const gap = 6;
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - (gap * (numColumns - 1)) - 32) / numColumns;

const ProductsView = ({ categoryId }: ProductsViewProps) => {
  const selectedBranchId = useBranchesStore((state) => state.selectedBranchId);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const parsedCategoryId = categoryId ? Number(categoryId) : null;
  const { addItem, isAddingItem } = useCartMutations();
  const showToast = useUiStore((s) => s.showToast);

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsByCategory(
    selectedBranchId,
    Number.isFinite(parsedCategoryId) ? parsedCategoryId : null
  );

  const products = useMemo(
    () => (data?.pages ?? []).flatMap((page) => (Array.isArray(page?.items) ? page.items : [])),
    [data]
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  async function onPressAdd(item: ProductDto) {
    try {
      const branchProductId = item.branchProductId;
      await addItem({ branchProductId, quantity: 1});
    } catch (error) {
      showToast(getErrorMessage(error, "No se pudo agregar al carrito"), "error");
    }
  }

  const renderItem = ({ item }: { item: ProductDto }) => (
    <View
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
          <Text style={[styles.prodImagePlaceholderText, { color: theme.text }]}>
            Sin imagen
          </Text>
        </View>
      )}
      <View style={styles.prodInfo}>
        <Text style={[styles.prodName, { color: theme.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.prodPrice, { color: theme.text }]}>
          {formatCurrency(item.finalPrice)}
        </Text>
        <TouchableOpacity 
          style={[styles.addIcon, { backgroundColor: theme.primary, opacity: isAddingItem ? 0.6 : 1, zIndex: 10, elevation: 10 }]}
          onPress={() => onPressAdd(item)}
          disabled={isAddingItem}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Plus size={16} color={theme.card} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isPending) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Error al cargar los productos</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>No hay productos en esta categoría.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={products}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : (
            <View style={styles.footerSpacer} />
          )
        }
      />
    </View>
  );
};

export default ProductsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    gap: gap,
    marginBottom: gap,
  },
  productCard: {
    width: cardWidth,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    height: 170,
  },
  prodImage: {
    width: "100%",
    height: 80,
    resizeMode: "contain",
  },
  prodImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  prodImagePlaceholderText: {
    fontSize: 10,
    fontWeight: "700",
    opacity: 0.7,
  },
  prodInfo: {
    padding: 8,
    position: "relative",
  },
  prodPrice: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 20,
  },
  prodName: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
    minHeight: 30,
  },
  addIcon: {
    position: "absolute",
    top: 55,
    right: 6,
    borderRadius: 100,
    padding: 6,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  footerSpacer: {
    height: 16,
  },
});