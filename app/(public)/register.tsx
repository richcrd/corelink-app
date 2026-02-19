import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Colors from "@/src/presentation/constants/Colors";
import { useColorScheme } from "@/src/presentation/hooks/useColorScheme";
import { useAuthActions } from "@/src/presentation/hooks/useAuthActions";
import { useUiStore } from "@/src/presentation/stores/uiStore";
import { getErrorMessage } from "@/src/presentation/feedback/getErrorMessage";
import { AuthScreenLayout } from "@/src/presentation/screens/auth/components/AuthScreenLayout";
import {
  AuthTextField,
  PasswordRightToggle,
  RightChevron,
} from "@/src/presentation/screens/auth/components/AuthTextField";
import { AuthButton } from "@/src/presentation/screens/auth/components/AuthButton";

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { register } = useAuthActions();
  const showToast = useUiStore((s) => s.showToast);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [locationId, setLocationId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      username.trim() &&
      password &&
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      locationId.trim() &&
      phoneNumber.trim() &&
      address.trim()
    );
  }, [
    address,
    email,
    firstName,
    lastName,
    locationId,
    password,
    phoneNumber,
    username,
  ]);

  async function onSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await register({
        username: username.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        locationId: locationId.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      });
      showToast("Cuenta creada", "success");
      router.replace("/(tabs)");
    } catch (e: any) {
      showToast(getErrorMessage(e, "No se pudo registrar"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreenLayout variant="register" title="¡Regístrate ahora!">
      {({ theme }) => (
        <>
          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <AuthTextField
                theme={theme}
                label="Primer Nombre"
                icon="user"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Tu Nombre"
              />
            </View>
            <View style={{ flex: 1 }}>
              <AuthTextField
                theme={theme}
                label="Apellido"
                icon="user"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Tu Apellido"
              />
            </View>
          </View>

          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <AuthTextField
                theme={theme}
                label="Usuario"
                icon="at"
                value={username}
                onChangeText={setUsername}
                placeholder="Tu usuario"
                inputProps={{
                  autoCapitalize: "none",
                  autoCorrect: false,
                  autoComplete: "username",
                  textContentType: "username",
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AuthTextField
                theme={theme}
                label="Teléfono"
                icon="phone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Tu Teléfono"
                inputProps={{
                  keyboardType: "phone-pad",
                  autoComplete: "tel",
                  textContentType: "telephoneNumber",
                }}
              />
            </View>
          </View>

          <AuthTextField
            theme={theme}
            label="Correo Electrónico"
            icon="envelope"
            value={email}
            onChangeText={setEmail}
            placeholder="Tu correo"
            inputProps={{
              autoCapitalize: "none",
              keyboardType: "email-address",
              autoComplete: "email",
              textContentType: "emailAddress",
            }}
          />

          <AuthTextField
            theme={theme}
            label="Ciudad"
            icon="map-marker"
            value={locationId}
            onChangeText={setLocationId}
            placeholder="Tu ciudad"
            inputProps={{ autoCapitalize: "none" }}
            right={<RightChevron theme={theme} />}
          />

          <AuthTextField
            theme={theme}
            label="Dirección"
            icon="home"
            value={address}
            onChangeText={setAddress}
            placeholder="Tu dirección"
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
              textContentType: "newPassword",
              secureTextEntry: !passwordVisible,
            }}
            right={
              <PasswordRightToggle
                theme={theme}
                visible={passwordVisible}
                onToggle={() => setPasswordVisible((v) => !v)}
                iconVisible="eye"
                iconHidden="eye-slash"
              />
            }
          />

          <AuthButton
            theme={theme}
            label="Crear Cuenta"
            loadingLabel="Registrando…"
            loading={submitting}
            disabled={!canSubmit}
            onPress={onSubmit}
          />

          <Pressable
            onPress={() => router.push("/(public)/login")}
            style={styles.bottomLinkBtn}
          >
            <Text
              style={[styles.bottomLinkText, { color: theme.tabIconDefault }]}
            >
              ¿Ya tienes cuenta?{" "}
              <Text style={{ color: theme.success, fontWeight: "900" }}>
                Inicia sesión
              </Text>
            </Text>
          </Pressable>
        </>
      )}
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  row2: {
    flexDirection: "row",
    gap: 12,
  },
  bottomLinkBtn: {
    marginTop: 14,
    alignItems: "center",
  },
  bottomLinkText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
