import { create } from "zustand";

type LoadingState = {
  loading: boolean;
  show: () => void;
  hide: () => void;
  set: (value: boolean) => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: false,
  show: () => set({ loading: true }),
  hide: () => set({ loading: false }),
  set: (value) => set({ loading: value }),
}));
