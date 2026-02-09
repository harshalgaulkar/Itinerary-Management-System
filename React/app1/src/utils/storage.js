import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Small wrapper to handle expo-secure-store API differences and web fallback.
async function trySecureStoreGet(key) {
  try {
    if (typeof SecureStore.getItemAsync === 'function') {
      return await SecureStore.getItemAsync(key);
    }
    if (typeof SecureStore.getValueWithKeyAsync === 'function') {
      return await SecureStore.getValueWithKeyAsync(key);
    }
  } catch (e) {
    // swallow and fallback
  }
  return null;
}

async function trySecureStoreSet(key, value) {
  try {
    if (typeof SecureStore.setItemAsync === 'function') {
      return await SecureStore.setItemAsync(key, value);
    }
    if (typeof SecureStore.setValueWithKeyAsync === 'function') {
      return await SecureStore.setValueWithKeyAsync(key, value);
    }
  } catch (e) {
    // swallow and fallback
  }
  return null;
}

async function trySecureStoreDelete(key) {
  try {
    if (typeof SecureStore.deleteItemAsync === 'function') {
      return await SecureStore.deleteItemAsync(key);
    }
    if (typeof SecureStore.deleteValueWithKeyAsync === 'function') {
      return await SecureStore.deleteValueWithKeyAsync(key);
    }
  } catch (e) {
    // swallow and fallback
  }
  return null;
}

export async function getItem(key) {
  // Web: prefer localStorage then AsyncStorage
  if (Platform.OS === 'web') {
    try {
      const v = window?.localStorage?.getItem(key);
      if (v != null) return v;
    } catch (e) {
      // ignore
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  // Native: try SecureStore first, then AsyncStorage
  const ss = await trySecureStoreGet(key);
  if (ss != null) return ss;
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export async function setItem(key, value) {
  if (Platform.OS === 'web') {
    try {
      window?.localStorage?.setItem(key, value);
      return;
    } catch (e) {
      // ignore
    }
    try {
      await AsyncStorage.setItem(key, value);
      return;
    } catch (e) {
      // ignore
    }
    return;
  }

  // Native: try SecureStore then AsyncStorage
  const r = await trySecureStoreSet(key, value);
  if (r !== null) return;
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // ignore
  }
}

export async function deleteItem(key) {
  if (Platform.OS === 'web') {
    try {
      window?.localStorage?.removeItem(key);
      return;
    } catch (e) {
      // ignore
    }
    try {
      await AsyncStorage.removeItem(key);
      return;
    } catch (e) {
      // ignore
    }
    return;
  }

  const r = await trySecureStoreDelete(key);
  if (r !== null) return;
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
}

export default {
  getItem,
  setItem,
  deleteItem,
};
