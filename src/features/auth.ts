import axios from "axios";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { post } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";
import { ENV } from "@/src/config/env";
import { isApiResponse } from "@/src/shared/http/types";
import { useAuthStore } from "../features/store/auth.store";
import { useUiStore } from "@/src/presentation/stores/ui.store";
import { getErrorMessage } from "@/src/presentation/feedback/ToastViewport";
import { useBranches } from "./branches";
import type { SelectOption } from "@/src/presentation/components/Select";

export type User = {
  id?: string;
  personId?: string;
  username: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterBody = {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  branchId?: number;
  locationId?: string;
  phoneNumber?: string;
  address?: string;
};

export type AuthSession = {
  token: string;
  refreshToken: string;
  user: User;
};

export type AuthResponseDto = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  userId: string;
  personId: string;
  username: string;
  role: string;
};

export type RefreshResponseDto = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};


export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return "Invitado";

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || user.username || "Invitado";
}

function mapToSession(dto: AuthResponseDto): AuthSession {
  return {
    token: dto.accessToken,
    refreshToken: dto.refreshToken,
    user: {
      id: dto.userId,
      personId: dto.personId,
      username: dto.username,
      role: dto.role,
    },
  };
}


const normalAxios = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { Accept: "application/json" },
});

export const authRepository = {
  login: (body: LoginCredentials) =>
    post<LoginCredentials, AuthResponseDto>(requests.auth.login, body),

  register: (body: RegisterBody) =>
    post<RegisterBody, AuthResponseDto>(requests.auth.register, body),

  async refresh(refreshToken: string): Promise<RefreshResponseDto> {
    const { data } = await normalAxios.post(requests.auth.refresh, {
      refreshToken,
    });
    return isApiResponse<RefreshResponseDto>(data) ? data.response : data;
  },
};


export function useAuth() {
  const setSession = useAuthStore((s) => s.setSession);

  return {
    login: async (credentials: LoginCredentials) => {
      if (!credentials.username || !credentials.password) {
        throw new Error("El usuario y contraseña son requeridos");
      }
      const dto = await authRepository.login(credentials);
      const session = mapToSession(dto);
      await setSession(session);
    },
    register: async (body: RegisterBody) => {
      if (!body.username || !body.password || !body.email || !body.firstName || !body.lastName) {
        throw new Error("Complete los campos requeridos");
      }
      const dto = await authRepository.register(body);
      const session = mapToSession(dto);
      await setSession(session);
    },
  };
}

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

export function useRegisterLocations(departmentId: number) {
  const { data: locations = [], isPending, refetch } = useBranches(departmentId);

  const options: SelectOption<number>[] = useMemo(
    () =>
      locations.map((l) => ({
        label: l.name,
        value: l.id,
      })),
    [locations],
  );

  function handleOpen() {
    if (!locations.length) {
      refetch();
    }
  }

  return {
    locationOptions: options,
    loadingLocations: isPending,
    handleOpen,
  };
}
