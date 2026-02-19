import * as SecureStore from "expo-secure-store";

export const secureStore = {
  async set<T>(key: string, value: T) {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  },

  async get<T>(key: string): Promise<T | null> {
    const value = await SecureStore.getItemAsync(key);
    return value ? (JSON.parse(value) as T) : null;
  },

  async remove(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};
