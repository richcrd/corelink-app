import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle2, Circle, Plus, Lock, CreditCard, CreditCardIcon } from "lucide-react-native";
import Colors from "../../constants/Colors";
import { useCart } from "@/src/features/cart/hooks/useCart";
import { useCartStore } from "@/src/features/cart/store/cartStore";
import { usePaymentMethods } from "@/src/features/checkout/hooks/usePaymentMethods";
import { useCheckout } from "@/src/features/checkout/hooks/useCheckout";
import { useUiStore } from "../../stores/ui.store";
import { formatCurrency } from "../../utils/common";
import { getErrorMessage } from "../../feedback/ToastViewport";

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const mutedTextColor = theme.tabIconDefault;

  const { data: cartData } = useCart();
  const items = cartData?.items || [];
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  const { data: paymentMethodsData, isPending: isLoadingPayments } = usePaymentMethods();
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);

  const { processCheckout, isProcessing } = useCheckout();
  const showToast = useUiStore((s) => s.showToast);

  React.useEffect(() => {
    if (paymentMethodsData && paymentMethodsData.length > 0 && selectedPayment === null) {
      setSelectedPayment(paymentMethodsData[0].id);
    }
  }, [paymentMethodsData, selectedPayment]);

  async function onPay() {
    if (!selectedPayment) {
      showToast("Selecciona un método de pago", "error");
      return;
    }
    try {
      const response = await processCheckout({
        paymentMethodId: selectedPayment,
      });

      if (response && response.orderId) {
        showToast("¡Orden procesada exitosamente!", "success");
        router.replace("/"); // home or success screen
      } else {
        showToast("No se pudo completar la orden.", "error");
      }
    } catch (e) {
      showToast(getErrorMessage(e, "Error al procesar el pago"), "error");
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 140 },
        ]}
      >
        {/* Cart Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Detalles del Pedido
            </Text>
          </View>
          <View style={styles.cartList}>
            {items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={[styles.cartItemImg, { borderColor: theme.border }]}
                  />
                ) : (
                  <View style={[styles.cartItemImg, styles.cartItemImgFallback, { borderColor: theme.border, backgroundColor: theme.background }]}>
                     <Text style={{ fontSize: 10, color: theme.tabIconDefault }}>Sin imagen</Text>
                  </View>
                )}
                <View style={styles.cartItemDetails}>
                  <Text
                    style={[styles.cartItemTitle, { color: theme.text }]}
                    numberOfLines={2}
                  >
                    {item.productName}
                  </Text>
                  <View style={styles.cartItemBottom}>
                    <Text style={[styles.cartItemPrice, { color: theme.text }]}>
                      {formatCurrency(item.subtotal)}
                    </Text>
                    <View
                      style={[
                        styles.cartItemQtyBadge,
                        { backgroundColor: theme.primaryMuted },
                      ]}
                    >
                      <Text
                        style={[styles.cartItemQty, { color: mutedTextColor }]}
                      >
                        x{item.quantity}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Método de Pago
            </Text>
          </View>
          <View style={styles.paymentOptions}>
            {isLoadingPayments ? (
              <ActivityIndicator color={theme.primary} />
            ) : paymentMethodsData?.map((method) => (
              <TouchableOpacity
                key={method.id}
                activeOpacity={0.8}
                onPress={() => setSelectedPayment(method.id)}
                style={[
                  styles.paymentOption,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  selectedPayment === method.id && {
                    borderColor: theme.primary,
                    backgroundColor: theme.primaryMuted,
                  },
                ]}
              >
                <View style={styles.paymentOptionLeft}>
                  <View style={styles.paymentIconWrapper}>
                    <View style={styles.cardIconMock}>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                         {method.icon || <CreditCardIcon color="#fff" size={12} /> }
                      </Text>
                    </View>
                  </View>
                  <View style={styles.paymentDetails}>
                    <Text style={[styles.paymentName, { color: theme.text }]}>
                      {method.name}
                    </Text>
                  </View>
                </View>
                {selectedPayment === method.id ? (
                  <CheckCircle2 color={theme.primary} size={20} />
                ) : (
                  <Circle color={theme.border} size={20} />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.addPaymentBtn}>
              <Plus color={theme.primary} size={16} />
              <Text style={[styles.addPaymentText, { color: theme.primary }]}>
                Agregar nueva tarjeta
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary Form */}
        <View
          style={[styles.summaryCard, { backgroundColor: theme.primaryMuted }]}
        >
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: mutedTextColor }]}>
              Subtotal ({totalItems} items)
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {formatCurrency(totalPrice)}
            </Text>
          </View>
          <View
            style={[styles.summaryTotalRow, { borderTopColor: theme.border }]}
          >
            <Text style={[styles.summaryTotalLabel, { color: theme.text }]}>
              Total a pagar
            </Text>
            <Text style={[styles.summaryTotalValue, { color: theme.primary }]}>
              {formatCurrency(totalPrice)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.payButton, { backgroundColor: isProcessing || items.length === 0 ? theme.primaryMuted : theme.primary }]}
          onPress={onPay}
          disabled={isProcessing || items.length === 0}
        >
          {isProcessing ? (
             <ActivityIndicator color={theme.textOnPrimary} size="small" />
          ) : (
            <View>
              <Text style={[styles.payButtonText, { color: theme.textOnPrimary }]}>
                Pagar {formatCurrency(totalPrice)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "500",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  addressIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addressInfo: {
    flex: 1,
    gap: 4,
  },
  addressName: {
    fontSize: 15,
    fontWeight: "600",
  },
  addressDetail: {
    fontSize: 13,
    lineHeight: 18,
  },
  cartList: {
    gap: 16,
  },
  cartItem: {
    flexDirection: "row",
    gap: 12,
  },
  cartItemImg: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  cartItemImgFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  cartItemVariant: {
    fontSize: 12,
    marginBottom: 8,
  },
  cartItemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartItemPrice: {
    fontSize: 15,
    fontWeight: "600",
  },
  cartItemQtyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cartItemQty: {
    fontSize: 13,
  },
  paymentOptions: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  paymentOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentIconWrapper: {
    width: 40,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconMock: {
    width: 24,
    height: 16,
    backgroundColor: "#1A1F71",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentDetails: {
    gap: 2,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: "500",
  },
  paymentNumber: {
    fontSize: 12,
  },
  addPaymentBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  addPaymentText: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryCard: {
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginTop: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 999,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
