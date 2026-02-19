import * as SecureStore from 'expo-secure-store';

export async function secureSetJson(key: string, value: unknown): Promise<void> {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function secureGetJson<T>(key: string): Promise<T | null> {
  const raw = await SecureStore.getItemAsync(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function secureRemove(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}
