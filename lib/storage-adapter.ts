import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Storage adapter untuk Supabase yang mendukung web (localStorage) dan mobile (AsyncStorage)
 */
export const createStorageAdapter = () => {
  // Deteksi platform
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    // Web: Gunakan localStorage
    return {
      getItem: (key: string): Promise<string | null> => {
        if (typeof window === 'undefined') {
          return Promise.resolve(null);
        }
        try {
          const item = localStorage.getItem(key);
          return Promise.resolve(item);
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string): Promise<void> => {
        if (typeof window === 'undefined') {
          return Promise.resolve();
        }
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch (error) {
          console.error('Error writing to localStorage:', error);
          return Promise.resolve();
        }
      },
      removeItem: (key: string): Promise<void> => {
        if (typeof window === 'undefined') {
          return Promise.resolve();
        }
        try {
          localStorage.removeItem(key);
          return Promise.resolve();
        } catch (error) {
          console.error('Error removing from localStorage:', error);
          return Promise.resolve();
        }
      },
    };
  } else {
    // Mobile: Gunakan AsyncStorage
    return {
      getItem: (key: string): Promise<string | null> => {
        return AsyncStorage.getItem(key).catch((error) => {
          console.error('Error reading from AsyncStorage:', error);
          return null;
        });
      },
      setItem: (key: string, value: string): Promise<void> => {
        return AsyncStorage.setItem(key, value).catch((error) => {
          console.error('Error writing to AsyncStorage:', error);
        });
      },
      removeItem: (key: string): Promise<void> => {
        return AsyncStorage.removeItem(key).catch((error) => {
          console.error('Error removing from AsyncStorage:', error);
        });
      },
    };
  }
};

