import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { createStorageAdapter } from './storage-adapter';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Deteksi platform
const isWeb = Platform.OS === 'web';

// Buat storage adapter berdasarkan platform
const storage = createStorageAdapter();

// Konfigurasi auth berdasarkan platform
const authConfig: any = {
  autoRefreshToken: true,
  persistSession: true,
  storage: storage,
  storageKey: 'sb-auth-token',
};

// Hanya untuk web
if (isWeb) {
  authConfig.detectSessionInUrl = true;
  authConfig.flowType = 'pkce';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: authConfig,
  // Global headers
  global: {
    headers: {
      'x-client-info': 'networkasro-app',
    },
  },
});

// Helper function untuk menangani error expired session
export async function handleSupabaseError(error: any, retryOperation?: () => Promise<any>) {
  // Cek apakah error terkait dengan expired session
  const isExpiredSession = 
    error?.message?.includes('expired') ||
    error?.message?.includes('Invalid JWT') ||
    error?.message?.includes('JWT') ||
    error?.code === 'PGRST301' ||
    error?.status === 401;

  if (isExpiredSession && retryOperation) {
    try {
      // Coba refresh session
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !session) {
        console.error('Failed to refresh session:', refreshError);
        throw new Error('Session expired. Please login again.');
      }

      // Retry operasi setelah refresh
      return await retryOperation();
    } catch (refreshError) {
      console.error('Error refreshing session:', refreshError);
      throw new Error('Session expired. Please login again.');
    }
  }

  // Jika bukan expired session error, throw error asli
  throw error;
}

