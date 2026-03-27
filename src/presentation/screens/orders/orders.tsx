import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { useOrders } from "@/src/features/orders/hooks/useOrders";
import { useRouter } from "expo-router";
import { formatCurrency } from "../../utils/common";
import Feather from "@expo/vector-icons/Feather";

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data, isPending, isError } = useOrders();

  if (isPending) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <View style={styles.centered}>
          <Text style={{ color: theme.text }}>Error al cargar tus compras.</Text>
        </View>
      </View>
    );
  }

  const orders = data || [];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <FlatList
        data={orders}
        keyExtractor={(item: any) => String(item.orderId)}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 + insets.bottom }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={{ color: theme.text }}>No has realizado ninguna compra aún.</Text>
          </View>
        }
        renderItem={({ item }) => {
          let status = item.status;
          let statusContent = null;
          if (status === "APPROVED") {
            statusContent = (
              <Feather name="check-circle" size={18} color={theme.primary} accessibilityLabel="Completada" />
            );
          } else if (status === "REJECTED") {
            statusContent = (
              <Text style={[styles.orderStatus, { color: theme.primary }]}>RECHAZADA</Text>
            );
          } else {
            statusContent = (
              <Text style={[styles.orderStatus, { color: theme.primary }]}>{status}</Text>
            );
          }
          return (
            <TouchableOpacity
              style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push(`/order/${item.orderId}` as const)}
            >
              <View style={styles.orderHeader}>
                <Text style={[styles.orderTitle, { color: theme.text }]}>Orden #{item.orderId}</Text>
                {statusContent}
              </View>
              <Text style={{ color: theme.text }}>Total: {formatCurrency(item.total)}</Text>
              <Text style={{ color: theme.tabIconDefault, fontSize: 12, marginTop: 4 }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  orderCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
  orderStatus: {
    fontWeight: "700",
    fontSize: 14,
  }
});
