import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { useAuthActions } from "@/src/presentation/hooks/useAuthActions";
import { useUiStore } from "@/src/presentation/stores/uiStore";
import { getErrorMessage } from "@/src/presentation/feedback/getErrorMessage";
import { AuthScreenLayout } from "@/src/presentation/screens/auth/components/AuthScreenLayout";
import {
  AuthTextField,
  PasswordRightToggle,
} from "@/src/presentation/screens/auth/components/AuthTextField";
import { AuthButton } from "@/src/presentation/screens/auth/components/AuthButton";

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { login } = useAuthActions();
  const showToast = useUiStore((s) => s.showToast);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => username.trim().length > 0 && password.length > 0,
    [password.length, username],
  );

  async function onSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await login({ username: username.trim(), password });
      showToast("Login correcto", "success");
      router.replace("/(tabs)");
    } catch (e: any) {
      showToast(getErrorMessage(e, "No se pudo iniciar sesión"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreenLayout
      variant="login"
      title="Iniciar sesión"
      subtitle="Compra tus productos del súper en minutos."
    >
      {({ theme }) => (
        <>
          <AuthTextField
            theme={theme}
            label="Usuario"
            icon="at"
            value={username}
            onChangeText={setUsername}
            placeholder="corelink"
            inputProps={{
              autoCapitalize: "none",
              autoCorrect: false,
              autoComplete: "username",
              textContentType: "username",
              returnKeyType: "next",
            }}
          />

          <AuthTextField
            theme={theme}
            label="Contraseña"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            inputProps={{
              autoComplete: "password",
              textContentType: "password",
              secureTextEntry: !passwordVisible,
              returnKeyType: "done",
              onSubmitEditing: onSubmit,
            }}
            right={
              <PasswordRightToggle
                theme={theme}
                visible={passwordVisible}
                onToggle={() => setPasswordVisible((v) => !v)}
                iconVisible="unlock"
                iconHidden="lock"
              />
            }
          />

          <AuthButton
            theme={theme}
            label="Entrar"
            loadingLabel="Ingresando…"
            loading={submitting}
            disabled={!canSubmit}
            onPress={onSubmit}
          />

          <Pressable
            onPress={() => router.push("/(public)/register")}
            style={styles.bottomLinkBtn}
          >
            <Text
              style={[styles.bottomLinkText, { color: theme.tabIconDefault }]}
            >
              ¿No tienes cuenta?{" "}
              <Text style={{ color: theme.success, fontWeight: "900" }}>
                Regístrate
              </Text>
            </Text>
          </Pressable>
        </>
      )}
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  bottomLinkBtn: {
    marginTop: 8,
    alignItems: "center",
  },
  bottomLinkText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
