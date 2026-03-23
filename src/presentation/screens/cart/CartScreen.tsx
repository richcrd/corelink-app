import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect } from "react";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "@/src/features/cart/hooks/useCart";
import { useCartStore } from "@/src/features/cart/store/cartStore";
import { getErrorMessage } from "../../feedback/ToastViewport";
import { Cart, CartItem } from "@/src/features/cart/types/Cart";
import { formatCurrency } from "../../utils/common";
import { useCartMutations } from "@/src/features/cart/hooks/useCartMutations";
import { useUiStore } from "../../stores/ui.store";
import { Minus, Plus, Trash } from "lucide-react-native";

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError, error, refetch, isFetching } = useCart();

  const setCart = useCartStore((s) => s.setCart);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());
  const { updateItem, removeItem, isUpdatingItem, isRemovingItem } = useCartMutations();
  const showToast = useUiStore((s) => s.showToast);

  async function onIncrease(item: CartItem) {
    try {
      await updateItem({ 
        branchProductId: item.branchProductId, 
        quantityDelta: 1 
      });
    } catch (e) {
      showToast(getErrorMessage(e, "No se pudo actualizar"), "error");
    }
  }

  async function onDecrease(item: CartItem) {
    try {
      await updateItem({
        branchProductId: item.branchProductId,
        quantityDelta: -1
      })
    } catch (e) {
      showToast(getErrorMessage(e, "No se pudo actualizar"), "error");
    }
  }

  async function onRemove(item: CartItem) {
    try {
      await removeItem(item.branchProductId);
    } catch (e) {
      showToast(getErrorMessage(e, "No se pudo eliminar"), "error");
    }
  }

  function onPressConfirm() {
    showToast("Ir a pagar", "success");
  }

  useEffect(() => {
    setCart(data ?? null);
  }, [data, setCart]);

  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
      </View>
    )
  }

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
    <View style={[styles.root, { backgroundColor: theme.card }]}>
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
        renderItem={({ item }) => (
          <CartRow 
            item={item} 
            theme={theme}
            onIncrease={() => onIncrease(item)}
            onDecrease={() => onDecrease(item)}
            onRemove={() => onRemove(item)}
            disabled={isUpdatingItem || isRemovingItem}
          />
        )}
      />
      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            paddingBottom: 12 + insets.bottom,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between', marginVertical: 10 }}>
          <Text>Items: {totalItems}</Text>
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16 }}>{formatCurrency(totalPrice)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
          onPress={() => onPressConfirm()}
        >
          <Text style={{ color: theme.textOnPrimary, fontWeight: '600' }}>Confirmar Carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CartRow({
  item,
  theme,
  onIncrease,
  onDecrease,
  onRemove,
  disabled,
}: {
  item: CartItem;
  theme: (typeof Colors)["light"] | (typeof Colors)["dark"];
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <View
      style={[
        styles.rowCard,
        { borderColor: theme.border },
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
          Unidad: {formatCurrency(item.price)}
        </Text>
        <Text style={[styles.productMeta, { color: theme.text, fontWeight: "800", marginTop: 10 }]}>
          {formatCurrency(item.subtotal)}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={onDecrease}
          disabled={disabled}
          style={[
            styles.qtyBtn,
            { borderColor: theme.border, opacity: disabled ? 0.6 : 1 },
          ]}
        >
          <Minus size={14} color={theme.text} />
        </Pressable>
        <Text style={[styles.qtyValue, { color: theme.text }]}>{item.quantity}</Text>
        <Pressable
          onPress={onIncrease}
          disabled={disabled}
          style={[
            styles.qtyBtn,
            { borderColor: theme.border, opacity: disabled ? 0.6 : 1 },
          ]}
        >
          <Plus size={14} color={theme.text} />
        </Pressable>
      </View>
      <Pressable onPress={onRemove} disabled={disabled} style={{ position: 'absolute', bottom: 55, right: 15 }}>
         <Trash color="red" size={14} />
      </Pressable>
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
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 0.7
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: "cover",
  },
  imageFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  productName: {
    fontSize: 12,
    fontWeight: "800",
  },
  productMeta: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
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
  actionsRow: {
    marginTop: 35,
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderWidth: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue:  {
    marginHorizontal: 10,
    minWidth: 18,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
  },
  confirmBtn: {
    width: '90%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 5,
  },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  }
});
