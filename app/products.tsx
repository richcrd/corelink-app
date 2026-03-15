import { Stack, useLocalSearchParams } from "expo-router";
import ProductsView from "@/src/presentation/screens/products/productsView/productsView";
import { AppHeader } from "@/src/presentation/components/AppHeader";

export default function ProductsScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <AppHeader
              variant="page"
              title="Productos"
              showSearch={true}
              showCart={true}
              onBackPress={() => navigation.goBack()}
            />
          )
        }}
      />
      <ProductsView categoryId={categoryId} />
    </>
  );
}
