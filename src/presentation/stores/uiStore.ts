import { create } from 'zustand';
import { Alert } from 'react-native';

export type ToastType = 'success' | 'error' | 'info';

export type ToastState = {
  visible: boolean;
  type: ToastType;
  message: string;
};

type UiStore = {
  toast: ToastState;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
  showAlert: (title: string, message?: string) => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUiStore = create<UiStore>((set) => ({
  toast: { visible: false, type: 'info', message: '' },
  showToast: (message, type = 'info') => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { visible: true, type, message } });
    toastTimer = setTimeout(() => set({ toast: { visible: false, type, message: '' } }), 2200);
  },
  hideToast: () => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { visible: false, type: 'info', message: '' } });
  },
  showAlert: (title, message) => Alert.alert(title, message),
}));
