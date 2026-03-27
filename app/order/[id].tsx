import React from "react";
import OrderDetailScreen from "@/src/presentation/screens/orders/OrderDetailScreen";
import { useLocalSearchParams, Stack } from "expo-router";
import { AppHeader } from "@/src/presentation/components/AppHeader";

export default function OrderRoute() {
  const { id } = useLocalSearchParams();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <AppHeader
              variant="page"
              title={`Detalle de Orden #${id}`}
              showSearch={false}
              showCart={false}
              onBackPress={() => navigation.goBack()}
            />
          ),
        }}
      />
      <OrderDetailScreen id={id as string} />
    </>
  );
}