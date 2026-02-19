import { create } from "zustand";
import { Alert } from "react-native";

export type ToastType = "success" | "error" | "info";

type UiStore = {
  toast: {
    visible: boolean;
    type: ToastType;
    message: string;
  };
  showToast: (message: string, type?: ToastType) => void;
  alert: (title: string, message?: string) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  toast: { visible: false, type: "info", message: "" },

  showToast: (message, type = "info") => {
    set({ toast: { visible: true, type, message } });

    setTimeout(() => {
      set({ toast: { visible: false, type, message: "" } });
    }, 2200);
  },

  alert: (title, message) => Alert.alert(title, message),
}));
