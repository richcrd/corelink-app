import { Stack } from "expo-router";
import { CheckoutScreen } from "@/src/presentation/screens";
import { AppHeader } from "@/src/presentation/components/AppHeader";

export default function CheckoutRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <AppHeader
              variant="page"
              title="Checkout"
              showSearch={false}
              showCart={false}
              onBackPress={() => navigation.goBack()}
            />
          ),
        }}
      />
      <CheckoutScreen />
    </>
  );
}
