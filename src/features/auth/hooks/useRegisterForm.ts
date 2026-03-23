import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { useUiStore } from "@/src/presentation/stores/ui.store";
import { getErrorMessage } from "@/src/presentation/feedback/ToastViewport";

type RegisterFormState = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  branchId?: number;
  phoneNumber: string;
  address: string;
};

export function useRegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const showToast = useUiStore((s) => s.showToast);

  const [form, setForm] = useState<RegisterFormState>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    branchId: undefined,
    phoneNumber: "",
    address: "",
  });

  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof RegisterFormState>(
    key: K,
    value: RegisterFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const canSubmit = useMemo(() => {
    return Object.values(form).every((v) => {
      if (typeof v === "string") return v.trim().length > 0;
      if (typeof v === "number") return v > 0;
      return false;
    });
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
        branchId: form.branchId,
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
