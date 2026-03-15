import { Stack } from "expo-router";
import CartScreen from "@/src/presentation/screens/cart/CartScreen";
import { AppHeader } from "@/src/presentation/components/AppHeader";

export default function CartRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <AppHeader
              variant="page"
              title="Carrito"
              showSearch={false}
              showCart={false}
              onBackPress={() => navigation.goBack()}
            />
          ),
        }}
      />
      <CartScreen />
    </>
  );
}
