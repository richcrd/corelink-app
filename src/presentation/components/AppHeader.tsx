import Feather from "@expo/vector-icons/Feather";
import { useSegments } from "expo-router";
import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { useUiStore } from "../stores/ui.store";
import { useAuthStore } from "@/src/features/store/auth.store";
import { useCartStore } from "@/src/features/store/cart.store";
import { useBranches, DEFAULT_DEPARTMENT_ID } from "@/src/features/branches";
import { useBranchesStore } from "@/src/features/store/branches.store";
import { getErrorMessage } from "@/src/presentation/feedback/ToastViewport";
import { Select } from "@/src/presentation/components/Select";

import { getUserDisplayName } from "@/src/features/auth";

import { HeaderCartButton } from "@/src/presentation/components/HeaderCartButton";
import { useCart } from "@/src/features/cart";

export type AppHeaderProps = {
  variant?: "default" | "page";
  title?: string;
  subTitle?: string;
  onBackPress?: () => void;
  showSearch?: boolean;
  showCart?: boolean;
  rightSlot?: ReactNode;
};

function isIndexSegment(seg: string | undefined): boolean {
  return !seg || seg === "index";
}

export function AppHeader({
  variant = "default",
  onBackPress,
  title,
  subTitle,
  showSearch,
  showCart,
  rightSlot,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = status === "authenticated";
  const displayName = getUserDisplayName(user);

  const cartCount = useCartStore((s) => s.totalItems());
  const setCart = useCartStore((s) => s.setCart);
  const showToast = useUiStore((s) => s.showToast);
  const branches = useBranchesStore((s) => s.branches);
  const selectedBranchId = useBranchesStore((s) => s.selectedBranchId);
  const setBranches = useBranchesStore((s) => s.setBranches);
  const selectBranch = useBranchesStore((s) => s.selectBranch);

  const { data } = useCart();

  const {
    data: fetchedBranches = [],
    isPending: loadingBranches,
    error: branchesError,
    refetch: refetchBranches,
  } = useBranches(DEFAULT_DEPARTMENT_ID);

  const branchOptions = useMemo(
    () =>
      branches.map((b) => ({
        label: b.name,
        value: b.id,
      })),
    [branches],
  );

  const group = segments[0];
  const route = segments[1];
  const inTabs = group === "(tabs)";

  const isHome =
    (group === "(tabs)" && isIndexSegment(route)) ||
    (group === "(public)" && isIndexSegment(route));

  const effectiveShowSearch = showSearch ?? isHome;
  const effectiveShowCart = showCart ?? isHome;

  const greetingTitle = isAuthenticated ? `Hola, ${displayName}!` : "Hola";
  const greetingSubTitle = isAuthenticated
    ? "¿Buscas algo hoy?"
    : inTabs
      ? "Inicia sesión para continuar"
      : "";

  const isPageVariant = variant === "page";

  useEffect(() => {
    if (fetchedBranches.length) {
      setBranches(fetchedBranches);
    }
    setCart(data ?? null);
  }, [data, setCart, fetchedBranches, setBranches]);

  useEffect(() => {
    if (branchesError) {
      showToast(
        getErrorMessage(branchesError, "Error cargando sucursales"),
        "error",
      );
    }
  }, [branchesError, showToast]);

  function onOpenBranchSelect() {
    if (!branches.length && !loadingBranches) {
      refetchBranches();
    }
  }

  function onChangeBranch(branchId: number) {
    selectBranch(branchId);
    const selected = branches.find((b) => b.id === branchId);
    if (selected) {
      showToast(`Sucursal: ${selected.name}`, "info");
    }
  }

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.primary,
          paddingTop: Math.max(16, insets.top + 8),
          paddingBottom: effectiveShowSearch ? 16 : 10,
        },
      ]}
    >
      {isPageVariant ? (
        <View
          style={[
            styles.pageRow,
            { marginBottom: effectiveShowSearch ? 12 : 0 },
          ]}
        >
          <Pressable
            onPress={onBackPress}
            hitSlop={8}
            style={({ pressed }) => [
              styles.backBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather
              name="chevron-left"
              size={28}
              color={theme.textOnPrimary}
            />
          </Pressable>

          <Text
            style={[styles.pageTitle, { color: theme.textOnPrimary }]}
            numberOfLines={1}
          >
            {title ?? "Detalle"}
          </Text>

          <View
            style={[
              styles.pageRight,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            {rightSlot}
            {effectiveShowCart ? (
              <View
                style={[
                  styles.actionPill,
                  {
                    backgroundColor: "transparent",
                    marginLeft: rightSlot ? 8 : 0,
                  },
                ]}
              >
                <HeaderCartButton
                  variant="onPrimary"
                  countOverride={cartCount}
                />
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.topRow,
            { marginBottom: effectiveShowSearch ? 12 : 0 },
          ]}
        >
          <View style={styles.titleBlock}>
            <View
              style={[styles.avatar, { backgroundColor: theme.primaryMuted }]}
            >
              <Feather name="user" size={16} color={theme.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.title, { color: theme.textOnPrimary }]}
                numberOfLines={1}
              >
                {title ?? greetingTitle}
              </Text>
              <Text
                style={[styles.subtitle, { color: theme.textOnPrimary }]}
                numberOfLines={1}
              >
                {subTitle ?? greetingSubTitle}
              </Text>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}

          {inTabs ? (
            <View style={styles.branchIconWrap}>
              <Select
                label={
                  loadingBranches
                    ? "Cargando sucursales..."
                    : "Selecciona sucursal"
                }
                value={selectedBranchId ?? undefined}
                options={branchOptions}
                onOpen={onOpenBranchSelect}
                onChange={onChangeBranch}
                renderTrigger={({ open }) => (
                  <Pressable
                    onPress={open}
                    style={({ pressed }) => [
                      styles.branchIconBtn,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Feather
                      name="map-pin"
                      size={18}
                      color={theme.textOnPrimary}
                    />
                  </Pressable>
                )}
                theme={{
                  card: theme.card,
                  text: theme.text,
                  primary: theme.primary,
                  border: theme.border,
                  placeholder: theme.tabIconDefault,
                }}
              />
            </View>
          ) : null}

          {effectiveShowCart ? (
            <View
              style={[styles.actionPill, { backgroundColor: "transparent" }]}
            >
              <HeaderCartButton variant="onPrimary" countOverride={cartCount} />
            </View>
          ) : null}
        </View>
      )}

      {effectiveShowSearch ? (
        <Pressable
          onPress={() => showToast("Búsquedas próximamente", "info")}
          style={({ pressed }) => [
            styles.searchContainer,
            {
              backgroundColor: theme.card,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Feather name="search" size={18} color={theme.tabIconDefault} />
          <Text
            style={[styles.searchPlaceholder, { color: theme.tabIconDefault }]}
          >
            Buscar productos...
          </Text>
          <View style={{ flex: 1 }} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  pageRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 34,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    flex: 1,
    marginLeft: 6,
    fontSize: 18,
    fontWeight: "800",
  },
  pageRight: {
    minWidth: 34,
    alignItems: "flex-end",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  titleBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.9,
  },

  rightSlot: {
    marginRight: 10,
  },
  actionPill: {
    borderRadius: 999,
  },

  searchContainer: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontWeight: "600",
  },
  branchIconWrap: {
    marginRight: 6,
  },
  branchIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});
