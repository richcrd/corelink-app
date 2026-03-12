import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AuthScreenLayout } from "@/src/presentation/screens/auth/components/AuthScreenLayout";
import {
  AuthTextField,
  PasswordRightToggle,
} from "@/src/presentation/screens/auth/components/AuthTextField";
import { AuthButton } from "@/src/presentation/screens/auth/components/AuthButton";
import { Select } from "@/src/presentation/components/Select";
import { useRegisterForm } from "@/src/features/auth/hooks/useRegisterForm";
import { useRegisterLocations } from "@/src/features/auth/hooks/useRegisterLocations";
import { DEFAULT_DEPARTMENT_ID } from "@/src/features/branches/constants";

export default function RegisterScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { form, setField, submitting, canSubmit, submit } = useRegisterForm();
  const { locationOptions, loadingLocations, handleOpen } = useRegisterLocations(DEFAULT_DEPARTMENT_ID);

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
                value={form.firstName}
                onChangeText={(v) => setField("firstName", v)}
                placeholder="Tu Nombre"
              />
            </View>
            <View style={{ flex: 1 }}>
              <AuthTextField
                theme={theme}
                label="Apellido"
                icon="user"
                value={form.lastName}
                onChangeText={(v) => setField("lastName", v)}
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
                value={form.username}
                onChangeText={(v) => setField("username", v)}
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
                value={form.phoneNumber}
                onChangeText={(v) => setField("phoneNumber", v)}
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
            value={form.email}
            onChangeText={(v) => setField("email", v)}
            placeholder="Tu correo"
            inputProps={{
              autoCapitalize: "none",
              keyboardType: "email-address",
              autoComplete: "email",
              textContentType: "emailAddress",
            }}
          />
          <Select
            label={
              loadingLocations
                ? "Cargando ciudades..."
                : "Selecciona una ciudad"
            }
            value={form.branchId}
            options={locationOptions}
            onChange={(v) => setField("branchId", v)}
            onOpen={handleOpen}
            theme={theme}
          />

          <AuthTextField
            theme={theme}
            label="Dirección"
            icon="home"
            value={form.address}
            onChangeText={(v) => setField("address", v)}
            placeholder="Tu dirección"
          />

          <AuthTextField
            theme={theme}
            label="Contraseña"
            icon="lock"
            value={form.password}
            onChangeText={(v) => setField("password", v)}
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
            onPress={submit}
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
