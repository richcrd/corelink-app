import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { useUiStore } from "@/src/presentation/stores/ui.store";
import { getErrorMessage } from "@/src/presentation/feedback/getErrorMessage";

export function useRegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const showToast = useUiStore((s) => s.showToast);

  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    locationId: "",
    phoneNumber: "",
    address: "",
  });

  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const canSubmit = useMemo(() => {
    return Object.values(form).every((v) => v.trim());
  }, [form]);

  async function submit() {
    if (!canSubmit || submitting) return;

    setSubmitting(true);

    try {
      await register({
        ...form,
        username: form.username.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        locationId: form.locationId.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
      });

      showToast("Cuenta creada", "success");
      router.replace("/(tabs)");
    } catch (e: unknown) {
      showToast(getErrorMessage(e, "No se pudo registrar"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    form,
    setField,
    submitting,
    canSubmit,
    submit,
  };
}
