import { useMemo, type ReactNode } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import Colors from '@/src/presentation/constants/Colors';
import { useColorScheme } from '@/src/presentation/hooks/useColorScheme';
import { AUTH_HEADER_IMAGE_URI } from '@/src/presentation/screens/auth/constants';

export type AuthLayoutVariant = 'login' | 'register';

type VariantConfig = {
  headerHeight: number;
  sheetMarginTop: number;
  sheetPaddingTop: number;
  scrollPaddingBottom: number;
};

const VARIANTS: Record<AuthLayoutVariant, VariantConfig> = {
  login: {
    headerHeight: 500,
    sheetMarginTop: -14,
    sheetPaddingTop: 35,
    scrollPaddingBottom: 10,
  },
  register: {
    headerHeight: 300,
    sheetMarginTop: -40,
    sheetPaddingTop: 18,
    scrollPaddingBottom: 24,
  },
};

export type AuthScreenLayoutRenderContext = {
  theme: (typeof Colors)['light'];
};

export function AuthScreenLayout({
  variant,
  title,
  subtitle,
  children,
}: {
  variant: AuthLayoutVariant;
  title: string;
  subtitle?: string;
  children: (ctx: AuthScreenLayoutRenderContext) => ReactNode;
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const config = useMemo(() => VARIANTS[variant], [variant]);

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safe, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: theme.background }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: config.scrollPaddingBottom }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.headerImage, { height: config.headerHeight }]}>
            <ImageBackground
              source={{ uri: AUTH_HEADER_IMAGE_URI }}
              style={styles.headerImageBg}
              resizeMode="cover"
            >
              <View
                style={[
                  styles.headerOverlay,
                  {
                    backgroundColor: theme.overlay,
                    paddingTop: insets.top,
                  },
                ]}
              />
            </ImageBackground>
          </View>

          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                marginTop: config.sheetMarginTop,
                paddingTop: config.sheetPaddingTop,
              },
            ]}
          >
            <View style={styles.formGrid}>
              <View style={styles.titleBlock}>
                <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                {subtitle ? (
                  <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>
                    {subtitle}
                  </Text>
                ) : null}
              </View>

              {children({ theme })}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
  },
  headerImageBg: {
    height: '100%',
    width: '100%',
  },
  headerOverlay: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 18,
    justifyContent: 'flex-end',
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  formGrid: {
    gap: 12,
  },
  titleBlock: {
    paddingTop: 6,
    paddingBottom: 2,
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
});
