import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect } from "react";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "@/src/features/cart/hooks/useCart";
import { useCartStore } from "@/src/features/cart/store/cartStore";
import { getErrorMessage } from "../../feedback/getErrorMessage";
import { CartItem } from "@/src/features/cart/types/Cart";
import { formatCurrency } from "../../utils/common";

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError, error, refetch, isFetching } = useCart();

  const setCart = useCartStore((s) => s.setCart);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());

  useEffect(() => {
    setCart(data ?? null);
  }, [data, setCart]);

  const items = data?.items ?? [];

  //   if (isLoading) {
  //     return (
  //         <View style={[styles.centered, { backgroundColor: theme.background }]}>
  //             <ActivityIndicator size="large" color={theme.primary} />
  //         </View>
  //     )
  //   }

  if (isError) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: theme.background, padding: 16 },
        ]}
      >
        <Text style={[styles.errorTitle, { color: theme.text }]}>
          No se pudo cargar el carrito
        </Text>
        <Text style={[styles.errorMessage, { color: theme.tabIconDefault }]}>
          {getErrorMessage(error, "Error inesperado")}
        </Text>
        <Pressable
          onPress={() => refetch()}
          style={({ pressed }) => [
            styles.retryBtn,
            { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.retryBtnText, { color: theme.textOnPrimary }]}>
            Reintentar
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          Tu carrito está vacío
        </Text>
        <Text style={[styles.emptySubTitle, { color: theme.tabIconDefault }]}>
          Agrega productos para verlos aqui
        </Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 110 + insets.bottom,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshing={isFetching}
        onRefresh={refetch}
        renderItem={({ item }) => <CartRow item={item} theme={theme} />}
      />
    </View>
  );
}

function CartRow({
  item,
  theme,
}: {
  item: CartItem;
  theme: (typeof Colors)["light"] | (typeof Colors)["dark"];
}) {
  return (
    <View
      style={[
        styles.rowCard,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View
          style={[
            styles.image,
            styles.imageFallback,
            { backgroundColor: theme.background },
          ]}
        >
          <Text
            style={{
              color: theme.tabIconDefault,
              fontSize: 11,
              fontWeight: "700",
            }}
          >
            Sin imagen
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text
          style={[styles.productName, { color: theme.text }]}
          numberOfLines={2}
        >
          {item.productName}
        </Text>
        <Text style={[styles.productMeta, { color: theme.tabIconDefault }]}>
          Cantidad: {item.quantity}
        </Text>
        <Text style={[styles.productMeta, { color: theme.tabIconDefault }]}>
          Unitario: {formatCurrency(item.price)}
        </Text>
      </View>

      <Text style={[styles.lineTotal, { color: theme.text }]}>
        {formatCurrency(item.subtotal)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  errorMessage: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 14,
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  retryBtnText: {
    fontSize: 13,
    fontWeight: "800",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubTitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  rowCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 58,
    height: 58,
    borderRadius: 8,
    resizeMode: "cover",
  },
  imageFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  productName: {
    fontSize: 14,
    fontWeight: "800",
  },
  productMeta: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
  },
  lineTotal: {
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 8,
  },
  summary: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "900",
  },
});
