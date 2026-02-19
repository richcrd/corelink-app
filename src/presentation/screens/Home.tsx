import Feather from '@expo/vector-icons/Feather';
import { useRouter, useSegments } from 'expo-router';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getCatalogUseCase } from '@/src/application/usecases/catalog/getCatalog';
import Colors from '@/src/presentation/constants/Colors';
import { useColorScheme } from '@/src/presentation/hooks/useColorScheme';
import { useCartStore } from '@/src/presentation/stores/cartStore';
import { useAuthStore } from '@/src/presentation/stores/authStore';
import { useUiStore } from '@/src/presentation/stores/uiStore';
import { useDependencies } from '@/src/presentation/di/DependenciesProvider';

import type { Category } from '@/src/domain/entities/Category';
import type { Product } from '@/src/domain/entities/Product';


const BANNER_IMAGE =
  'https://storage.googleapis.com/banani-generated-images/generated-images/63deaca5-8ab3-4eda-9828-52449114a730.jpg';

const CATEGORY_ICONS: string[] = [
  'https://cdn-icons-png.flaticon.com/512/1625/1625048.png',
  'https://cdn-icons-png.flaticon.com/512/3050/3050158.png',
  'https://cdn-icons-png.flaticon.com/512/2405/2405479.png',
  'https://cdn-icons-png.flaticon.com/512/994/994928.png',
];

const PRODUCT_IMAGES: string[] = [
  'https://storage.googleapis.com/banani-generated-images/generated-images/066ee4b3-91f1-4418-a216-3f6d2e3a1326.jpg',
  'https://storage.googleapis.com/banani-generated-images/generated-images/250678c0-0fff-45a1-8895-546650b503ee.jpg',
  'https://storage.googleapis.com/banani-generated-images/generated-images/66fac312-220a-4430-a5c5-e502ebf4b37f.jpg',
  'https://storage.googleapis.com/banani-generated-images/generated-images/4c994bd6-cebf-4c52-aab2-44d3dbdc3fec.jpg',
  'https://storage.googleapis.com/banani-generated-images/generated-images/b0d9ccec-486d-4e15-93db-c63cc73fc646.jpg',
];

function money(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const status = useAuthStore((s) => s.status);

  const add = useCartStore((s) => s.add);
  const cartCount = useCartStore((s) => s.totalItems());

  const showToast = useUiStore((s) => s.showToast);

  const catalogRepository = useDependencies().catalogRepository;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const inTabsGroup = segments[0] === '(tabs)';
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    (async () => {
      const data = await getCatalogUseCase(catalogRepository);
      setCategories(data.categories);
      setProducts(data.products);
      setActiveCategoryId(data.categories[0]?.id ?? null);
    })();
  }, [catalogRepository]);

  const visibleProducts = useMemo(() => {
    if (!activeCategoryId) return products;
    return products.filter((p) => p.categoryId === activeCategoryId);
  }, [activeCategoryId, products]);

  function onAdd(product: Product) {
    if (!isAuthenticated) {
      showToast('Inicia sesión para agregar al carrito', 'info');
      router.push('/(public)/login');
      return;
    }
    add(product);
    showToast(`Agregado: ${product.name}`, 'success');
  }

  function onPressCart() {
    if (!isAuthenticated) {
      showToast('Inicia sesión para ver tu carrito', 'info');
      router.push('/(public)/login');
      return;
    }
    showToast('Carrito próximamente', 'info');
  }

  function onPressComingSoon() {
    showToast('Próximamente', 'info');
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
      >
        <View style={styles.bannerSection}>
          <ImageBackground
            source={{ uri: BANNER_IMAGE }}
            style={[styles.bannerCard, { backgroundColor: theme.card }]}
            imageStyle={styles.bannerImage}
          >
            <View style={[styles.bannerOverlay, { backgroundColor: theme.overlay }]} />
            <View style={styles.bannerContent}>
              <Text style={[styles.bannerTitle, { color: theme.textOnPrimary }]}>¡Martes de Frescura!</Text>
              <Text style={[styles.bannerSubtitle, { color: theme.textOnPrimary }]}>Hasta 40% OFF en Frutas y Verduras</Text>
              <Pressable
                onPress={onPressComingSoon}
                style={({ pressed }) => [
                  styles.bannerBtn,
                  { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <Text style={[styles.bannerBtnText, { color: theme.textOnPrimary }]}>Ver Ofertas</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Categorías</Text>
            <Pressable onPress={onPressComingSoon}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>Ver todas</Text>
            </Pressable>
          </View>

          <FlatList
            data={categories}
            keyExtractor={(c) => c.id}
            scrollEnabled={false}
            numColumns={4}
            columnWrapperStyle={{ gap: 12 }}
            contentContainerStyle={{ gap: 16 }}
            renderItem={({ item, index }) => {
              const active = item.id === activeCategoryId;
              const iconUrl = CATEGORY_ICONS[index % CATEGORY_ICONS.length];

              return (
                <Pressable
                  onPress={() => setActiveCategoryId(item.id)}
                  style={({ pressed }) => [
                    styles.categoryItem,
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <View
                    style={[
                      styles.catIconBox,
                      {
                        backgroundColor: theme.card,
                        borderColor: active ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: iconUrl }}
                      style={{ width: 30, height: 30, resizeMode: 'contain' }}
                    />
                  </View>
                  <Text
                    style={[styles.catLabel, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        <View style={[styles.section, { paddingRight: 0 }]}>
          <View style={[styles.sectionHeader, { paddingRight: 16 }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Más vendidos</Text>
            <Pressable onPress={onPressComingSoon}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>Ver todos</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsRow}
          >
            {visibleProducts.map((p, idx) => {
              const img = PRODUCT_IMAGES[idx % PRODUCT_IMAGES.length];
              return (
                <View
                  key={p.id}
                  style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <Image source={{ uri: img }} style={styles.prodImage} />
                  <View style={styles.prodInfo}>
                    <Text style={[styles.prodPrice, { color: theme.text }]}>{money(p.price)}</Text>
                    <Text style={[styles.prodName, { color: theme.tabIconDefault }]} numberOfLines={2}>
                      {p.name}
                    </Text>
                    <Pressable
                      onPress={() => onAdd(p)}
                      style={({ pressed }) => [
                        styles.addBtn,
                        { backgroundColor: theme.primaryMuted, opacity: pressed ? 0.9 : 1 },
                      ]}
                    >
                      <Feather name="plus" size={16} color={theme.primary} />
                      <Text style={[styles.addBtnText, { color: theme.primary }]}>Agregar</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={[styles.section, { paddingTop: 0, paddingRight: 0 }]}>
          <View style={[styles.sectionHeader, { paddingRight: 16 }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Ofertas Relámpago</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsRow}
          >
            {visibleProducts.slice(0, 5).map((p, idx) => {
              const img = PRODUCT_IMAGES[(idx + 2) % PRODUCT_IMAGES.length];
              return (
                <View
                  key={`${p.id}-deal`}
                  style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <Image source={{ uri: img }} style={styles.prodImage} />
                  <View style={styles.prodInfo}>
                    <Text style={[styles.prodPrice, { color: theme.danger }]}>{money(p.price)}</Text>
                    <Text style={[styles.prodName, { color: theme.tabIconDefault }]} numberOfLines={2}>
                      {p.name}
                    </Text>
                    <Pressable
                      onPress={() => onAdd(p)}
                      style={({ pressed }) => [
                        styles.addBtn,
                        { backgroundColor: theme.primaryMuted, opacity: pressed ? 0.9 : 1 },
                      ]}
                    >
                      <Feather name="plus" size={16} color={theme.primary} />
                      <Text style={[styles.addBtnText, { color: theme.primary }]}>Agregar</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          {
            paddingBottom: Math.max(16, insets.bottom),
            backgroundColor: theme.card,
            borderTopColor: theme.border,
          },
        ]}
      >
        <NavItem
          icon={<Feather name="home" size={22} color={theme.primary} />}
          label="Inicio"
          active
          onPress={() => {
            if (inTabsGroup) router.replace('/(tabs)');
            else router.replace('/(public)');
          }}
          theme={theme}
        />
        <NavItem
          icon={<Feather name="grid" size={22} color={theme.tabIconDefault} />}
          label="Pasillos"
          onPress={onPressComingSoon}
          theme={theme}
        />
        <NavItem
          icon={
            <View style={{ position: 'relative' }}>
              <Feather name="shopping-cart" size={22} color={theme.tabIconDefault} />
              {cartCount > 0 ? (
                <View style={[styles.cartBadge, { backgroundColor: theme.danger }]}
                >
                  <Text style={[styles.cartBadgeText, { color: theme.textOnPrimary }]}>
                    {cartCount}
                  </Text>
                </View>
              ) : null}
            </View>
          }
          label="Carrito"
          onPress={onPressCart}
          theme={theme}
        />
        <NavItem
          icon={<Feather name="heart" size={22} color={theme.tabIconDefault} />}
          label="Favoritos"
          onPress={onPressComingSoon}
          theme={theme}
        />
        <NavItem
          icon={<Feather name="user" size={22} color={theme.tabIconDefault} />}
          label="Cuenta"
          onPress={onPressComingSoon}
          theme={theme}
        />
      </View>
    </View>
  );
}

function NavItem({
  icon,
  label,
  active,
  onPress,
  theme,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onPress: () => void;
  theme: (typeof Colors)['light'];
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.navItem, { opacity: pressed ? 0.75 : 1 }]}
    >
      {icon}
      <Text
        style={[
          styles.navLabel,
          { color: active ? theme.primary : theme.tabIconDefault },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },

  searchContainer: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontWeight: '600',
  },

  authPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  authPillText: {
    fontSize: 12,
    fontWeight: '800',
  },

  bannerSection: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  bannerCard: {
    height: 160,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '62%',
  },
  bannerContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '62%',
    padding: 18,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  bannerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.92,
  },
  bannerBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '800',
  },

  categoryItem: {
    flex: 1,
    alignItems: 'center',
  },
  catIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.9,
    textAlign: 'center',
    width: '100%',
  },

  productsRow: {
    paddingLeft: 16,
    paddingRight: 16,
    gap: 16,
  },
  productCard: {
    width: 140,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  prodImage: {
    width: '100%',
    height: 100,
  },
  prodInfo: {
    padding: 10,
  },
  prodPrice: {
    fontSize: 16,
    fontWeight: '900',
  },
  prodName: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
    minHeight: 32,
  },
  addBtn: {
    marginTop: 10,
    height: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },

  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    width: 70,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  cartBadge: {
    position: 'absolute',
    right: -8,
    top: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 12,
  },
});
