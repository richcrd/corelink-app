import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { formatCurrency } from "../../utils/common";
import { useOrderDetails } from "@/src/features/orders/hooks/useOrderDetails";
import { OrderItem } from "@/src/features/orders/types/Order";
import { getErrorMessage } from "../../feedback/ToastViewport";

export default function OrderDetailScreen({ id }: { id: string }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { data: order, isPending, isError, error } = useOrderDetails(id);

  if (isPending) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
      </View>
    )
  }

  if (isError || !order) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <View
          style={[
            styles.centered,
            { padding: 16 },
          ]}
        >
          <Text style={[styles.errorTitle, { color: theme.text }]}>
            No se pudo cargar la orden
          </Text>
          <Text style={[styles.errorMessage, { color: theme.tabIconDefault }]}>
            {getErrorMessage(error, "Error inesperado")}
          </Text>
        </View>
      </View>
    );
  }

  const items = order.items ?? [];

  return (
    <View style={[styles.root, { backgroundColor: theme.card }]}>
      <FlatList
        data={items}
        keyExtractor={(item, idx) => String(idx)}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 110 + insets.bottom,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 12, color: theme.tabIconDefault, marginTop: 4 }}>
              {new Date(order.createdAt).toLocaleString()}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <OrderRow item={item} theme={theme} />
        )}
      />
      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            paddingBottom: insets.bottom || 16,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between', marginVertical: 10 }}>
          <Text style={{ color: theme.text }}>Total de la Compra:</Text>
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16 }}>{formatCurrency(order.total)}</Text>
        </View>
      </View>
    </View>
  );
}

function OrderRow({
  item,
  theme,
}: {
  item: OrderItem;
  theme: (typeof Colors)["light"] | (typeof Colors)["dark"];
}) {
  return (
    <View style={[styles.rowCard, { borderColor: theme.border }]}>
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
          <Text style={{ color: theme.tabIconDefault, fontSize: 11, fontWeight: "700" }}>Sin imagen</Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
          {item.productName}
        </Text>
        <Text style={[styles.productMeta, { color: theme.tabIconDefault }]}>
          Unidad: {formatCurrency(item.unitPrice)}
        </Text>
        <Text style={[styles.productMeta, { color: theme.text, fontWeight: "800", marginTop: 10 }]}>
          {formatCurrency(item.subtotal)}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <Text style={[styles.qtyValue, { color: theme.primary }]}>x{item.quantity}</Text>
      </View>
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
  actionsRow: {
    alignItems: "center",
  },
  qtyValue:  {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "800",
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