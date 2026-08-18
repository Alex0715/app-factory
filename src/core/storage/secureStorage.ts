import * as SecureStore from 'expo-secure-store';
import { AppError } from '@core/errors';

/**
 * Thin wrapper around expo-secure-store for sensitive local data (auth
 * tokens, purchase receipts). Backed by Keystore on Android / Keychain on
 * iOS. Never store sensitive values in AsyncStorage or plain preferences.
 */
export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (cause) {
      throw AppError.database(cause);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (cause) {
      throw AppError.database(cause);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (cause) {
      throw AppError.database(cause);
    }
  },
};

export const SecureStorageKeys = {
  authToken: 'auth_token',
  purchaseReceipt: 'purchase_receipt',
} as const;
