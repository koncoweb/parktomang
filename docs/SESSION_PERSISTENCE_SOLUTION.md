# Dokumentasi Solusi Session Persistence untuk Expo Web

## Ringkasan Masalah

### Masalah yang Dihadapi
1. **Session hilang setelah pindah tab browser** - User terlogout otomatis saat berpindah ke tab lain
2. **Data tidak tersimpan** - Operasi database gagal setelah pindah tab atau minimize browser
3. **Session tidak persist setelah reload** - User harus login ulang setiap kali reload halaman

### Gejala yang Teramati
- Session terdeteksi saat tab aktif, tetapi hilang saat pindah tab
- Error "Session expired" atau "Invalid JWT" saat operasi database
- User ter-redirect ke halaman login setelah pindah tab

---

## Root Cause Analysis

### 1. Auto-Refresh Tidak Aktif untuk Web
**Masalah:**
- `supabase.auth.startAutoRefresh()` hanya dipanggil untuk platform mobile (AppState)
- Web platform tidak memiliki mekanisme untuk memulai auto-refresh secara eksplisit
- Browser throttling membuat JavaScript execution di tab yang tidak aktif menjadi lambat atau terhenti

**Dampak:**
- Token refresh tidak terjadi otomatis saat tab tidak aktif
- Session token expired tanpa refresh yang tepat waktu

### 2. Visibility Change Handler Tidak Optimal
**Masalah:**
- Handler visibility change terlalu agresif, memanggil `refreshSession()` yang force refresh
- Tidak ada throttling yang memadai, menyebabkan multiple refresh calls
- Tidak ada pengecekan untuk menghindari refresh saat baru login

**Dampak:**
- Race condition antara login flow dan visibility handler
- Unnecessary refresh calls yang membebani server
- Interferensi dengan flow login

### 3. Storage Adapter Tidak Konsisten
**Masalah:**
- Supabase client tidak dikonfigurasi dengan storage adapter yang eksplisit
- Perbedaan antara web (localStorage) dan mobile (AsyncStorage) tidak di-handle dengan baik
- Storage key mungkin tidak konsisten

**Dampak:**
- Session tidak tersimpan dengan benar di storage
- Session tidak bisa di-restore setelah reload

### 4. Session State Tidak Sinkron
**Masalah:**
- State di React tidak selalu sinkron dengan session di storage
- `onAuthStateChange` mungkin tidak menangani semua edge cases
- Initial load tidak menunggu session restore dengan benar

**Dampak:**
- State menunjukkan user tidak authenticated padahal session masih ada di storage
- Redirect ke login padahal session masih valid

---

## Solusi yang Diimplementasikan

### 1. Platform-Aware Storage Adapter

**File: `lib/storage-adapter.ts`**

Membuat storage adapter yang mendukung web (localStorage) dan mobile (AsyncStorage):

```typescript
export const createStorageAdapter = () => {
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return {
      getItem: (key: string): Promise<string | null> => {
        if (typeof window === 'undefined') return Promise.resolve(null);
        try {
          return Promise.resolve(localStorage.getItem(key));
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string): Promise<void> => {
        if (typeof window === 'undefined') return Promise.resolve();
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch (error) {
          console.error('Error writing to localStorage:', error);
          return Promise.resolve();
        }
      },
      removeItem: (key: string): Promise<void> => {
        if (typeof window === 'undefined') return Promise.resolve();
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
```

**Keuntungan:**
- Konsisten antara web dan mobile
- Error handling yang robust
- Platform detection otomatis

---

### 2. Konfigurasi Supabase Client dengan Storage Adapter

**File: `lib/supabase.ts`**

```typescript
const isWeb = Platform.OS === 'web';
const storage = createStorageAdapter();

const authConfig: any = {
  autoRefreshToken: true,
  persistSession: true,
  storage: storage,
  storageKey: 'sb-auth-token',
};

if (isWeb) {
  authConfig.detectSessionInUrl = true;
  authConfig.flowType = 'pkce';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: authConfig,
  global: {
    headers: {
      'x-client-info': 'networkasro-app',
    },
  },
});
```

**Keuntungan:**
- Storage adapter eksplisit untuk semua platform
- Auto-refresh token enabled
- Session persistence enabled
- PKCE flow untuk web (lebih secure)

---

### 3. Auto-Refresh untuk Web Platform

**File: `hooks/use-auth.tsx`**

Menambahkan auto-refresh untuk web saat component mount:

```typescript
useEffect(() => {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Start auto-refresh untuk web saat component mount
  console.log('Starting auto-refresh for web...');
  supabase.auth.startAutoRefresh();
  
  // ... visibility change handlers
}, []);
```

**Keuntungan:**
- Auto-refresh aktif sejak awal untuk web
- Token akan di-refresh otomatis sebelum expired

---

### 4. Visibility Change Handler yang Optimal

**File: `hooks/use-auth.tsx`**

Handler yang lebih gentle dan tidak mengganggu flow login:

```typescript
useEffect(() => {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  supabase.auth.startAutoRefresh();

  let isRefreshing = false;
  let lastVisibilityChange = 0;
  let lastSessionCheck = 0;

  const handleVisibilityChange = async () => {
    if (!document.hidden) {
      // Throttle: hanya refresh jika lebih dari 2 detik sejak perubahan terakhir
      const now = Date.now();
      if (now - lastVisibilityChange < 2000) {
        return;
      }
      lastVisibilityChange = now;

      // Jangan refresh jika baru saja ada perubahan session (misalnya baru login)
      // Tunggu minimal 3 detik setelah perubahan terakhir
      if (now - lastSessionCheck < 3000) {
        console.log('Skipping visibility refresh - recent session change');
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          console.log('Tab became visible, checking session...');
          supabase.auth.startAutoRefresh();
          
          // Gunakan ensureValidSession yang lebih gentle daripada refreshSession
          if (ensureValidSessionRef.current) {
            await ensureValidSessionRef.current();
          }
        } catch (error) {
          console.error('Error handling visibility change:', error);
        } finally {
          isRefreshing = false;
        }
      }
    } else {
      console.log('Tab hidden, auto-refresh continues in background');
    }
  };

  // Track session changes untuk menghindari refresh yang terlalu sering
  const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
      lastSessionCheck = Date.now();
    }
  });

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleFocus);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleFocus);
    authSubscription.unsubscribe();
  };
}, []);
```

**Fitur Kunci:**
- **Throttling 2 detik** - Mencegah multiple refresh calls
- **Session change tracking** - Skip refresh jika baru ada perubahan session (3 detik)
- **Gentle refresh** - Menggunakan `ensureValidSession` bukan `refreshSession` yang force
- **Auto-refresh tetap aktif** - Tidak stop auto-refresh saat tab hidden

**Keuntungan:**
- Tidak mengganggu flow login
- Mengurangi unnecessary refresh calls
- Lebih efisien dalam penggunaan resource

---

### 5. Perbaikan refreshSession untuk Lebih Robust

**File: `hooks/use-auth.tsx`**

```typescript
const refreshSession = useCallback(async () => {
  try {
    console.log('Attempting to refresh session...');
    
    // Langsung coba refresh - Supabase akan otomatis membaca refresh token dari storage adapter
    const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error('Error refreshing session:', refreshError);
      
      // Jika refresh gagal, coba baca session dari storage sekali lagi
      const { data: { session: fallbackSession }, error: getSessionError } = await supabase.auth.getSession();
      
      if (getSessionError) {
        console.error('Error getting session after refresh failure:', getSessionError);
      }
      
      // Jika ada fallback session, gunakan itu
      if (fallbackSession) {
        console.log('Using fallback session from storage');
        setSession(fallbackSession);
        setUser(fallbackSession.user ?? null);
        if (fallbackSession.user) {
          await fetchProfile(fallbackSession.user.id);
        }
        return { session: fallbackSession, error: null };
      }
      
      // Clear session jika refresh token tidak valid
      if (
        refreshError.message?.includes('expired') || 
        refreshError.message?.includes('Invalid') ||
        refreshError.message?.includes('refresh_token_not_found')
      ) {
        console.log('Session expired or refresh token not found, clearing...');
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      return { session: null, error: refreshError };
    }

    if (refreshedSession) {
      console.log('Session refreshed successfully');
      setSession(refreshedSession);
      setUser(refreshedSession.user ?? null);
      if (refreshedSession.user) {
        await fetchProfile(refreshedSession.user.id);
      }
      return { session: refreshedSession, error: null };
    }

    // Jika tidak ada session setelah refresh, coba baca dari storage sekali lagi
    const { data: { session: storageSession }, error: getSessionError } = await supabase.auth.getSession();
    
    if (storageSession) {
      console.log('Found session in storage');
      setSession(storageSession);
      setUser(storageSession.user ?? null);
      if (storageSession.user) {
        await fetchProfile(storageSession.user.id);
      }
      return { session: storageSession, error: null };
    }

    return { session: null, error: new Error('No session to refresh') };
  } catch (error) {
    console.error('Error in refreshSession:', error);
    return { session: null, error };
  }
}, [fetchProfile]);
```

**Fitur Kunci:**
- **Fallback mechanism** - Jika refresh gagal, coba baca dari storage
- **Multiple attempts** - Mencoba beberapa cara untuk mendapatkan session
- **Proper error handling** - Clear session hanya jika benar-benar expired

---

### 6. Perbaikan ensureValidSession

**File: `hooks/use-auth.tsx`**

```typescript
const ensureValidSession = useCallback(async () => {
  try {
    // Selalu baca session langsung dari storage untuk memastikan sinkronisasi
    const { data: { session: currentSession }, error: getSessionError } = await supabase.auth.getSession();
    
    if (getSessionError) {
      console.error('Error getting session:', getSessionError);
      return await refreshSession();
    }

    if (!currentSession) {
      console.log('No current session, attempting refresh from storage...');
      const refreshResult = await refreshSession();
      if (refreshResult.session) {
        return refreshResult;
      }
      return { session: null, error: new Error('No active session') };
    }

    // Cek apakah session expired (dengan margin 5 menit untuk lebih aman)
    const expiresAt = currentSession.expires_at;
    if (expiresAt) {
      const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
      // Jika token akan expired dalam 5 menit atau sudah expired, refresh
      if (expiresIn < 300) {
        console.log(`Session expiring soon (${expiresIn}s), refreshing...`);
        const refreshResult = await refreshSession();
        if (refreshResult.session) {
          return refreshResult;
        }
        // Jika refresh gagal tapi masih ada waktu, gunakan session yang ada
        if (expiresIn > 0) {
          console.warn('Refresh failed but session still valid, using current session');
          if (currentSession.access_token !== session?.access_token) {
            setSession(currentSession);
            setUser(currentSession.user ?? null);
            if (currentSession.user) {
              await fetchProfile(currentSession.user.id);
            }
          }
          return { session: currentSession, error: null };
        }
        return { session: null, error: new Error('Session expired') };
      }
    }

    // Session masih valid, update state jika berbeda untuk memastikan sinkronisasi
    if (!session || currentSession.access_token !== session.access_token) {
      console.log('Updating session state from storage');
      setSession(currentSession);
      setUser(currentSession.user ?? null);
      if (currentSession.user) {
        await fetchProfile(currentSession.user.id);
      }
    }

    return { session: currentSession, error: null };
  } catch (error) {
    console.error('Error in ensureValidSession:', error);
    const refreshResult = await refreshSession();
    return refreshResult;
  }
}, [session, refreshSession, fetchProfile]);
```

**Fitur Kunci:**
- **Selalu baca dari storage** - Memastikan sinkronisasi dengan storage
- **Proactive refresh** - Refresh jika akan expired dalam 5 menit
- **State synchronization** - Update state jika berbeda dengan storage

---

### 7. Perbaikan Login Flow

**File: `app/login.tsx`**

Menambahkan delay sebelum redirect untuk memberi waktu profile di-load:

```typescript
const handleLogin = async () => {
  if (!email || !password) {
    setError('Email dan password harus diisi');
    return;
  }

  setIsLoading(true);
  setError(null);

  const { error: signInError } = await signIn({ email, password });

  if (signInError) {
    setIsLoading(false);
    setError(signInError.message || 'Gagal masuk. Periksa email dan password Anda.');
    return;
  }

  // Tunggu sebentar untuk memastikan session dan profile sudah di-load
  // Redirect akan dihandle oleh app/index.tsx berdasarkan role setelah profile ter-load
  setTimeout(() => {
    setIsLoading(false);
    router.replace('/');
  }, 500);
};
```

**Keuntungan:**
- Memberi waktu untuk profile di-load
- Mencegah race condition antara login dan redirect

---

### 8. Perbaikan Redirect Logic

**File: `app/index.tsx`**

Menambahkan timeout untuk menunggu profile di-load:

```typescript
export default function Index() {
  const { isAuthenticated, isLoading, profile, user } = useAuth();
  const router = useRouter();
  const lastRedirectRef = useRef<string | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }

    if (isLoading) {
      console.log('Index: Still loading...');
      return;
    }

    const role = profile?.role;
    
    if (!isAuthenticated || !user) {
      console.log('Index: Not authenticated, redirecting to login');
      const target = '/login';
      if (lastRedirectRef.current !== target) {
        lastRedirectRef.current = target;
        router.replace(target);
      }
      return;
    }

    // Jika ada user tapi profile belum di-load, tunggu sebentar
    if (!profile || !role) {
      console.log('Index: User authenticated but profile not loaded yet, waiting...');
      redirectTimeoutRef.current = setTimeout(() => {
        if (!profile || !profile.role) {
          console.log('Index: Profile still not loaded after timeout, redirecting to login');
          const target = '/login';
          if (lastRedirectRef.current !== target) {
            lastRedirectRef.current = target;
            router.replace(target);
          }
        }
      }, 2000);
      return;
    }

    // Determine redirect target based on role
    let target: string;
    if (role === 'owner') {
      target = '/(owner)/dashboard';
    } else if (role === 'admin') {
      target = '/(admin)/dashboard';
    } else if (role === 'sales') {
      target = '/(sales)/dashboard';
    } else {
      target = '/login';
    }

    if (lastRedirectRef.current !== target) {
      console.log('Index: Redirecting to', target);
      lastRedirectRef.current = target;
      router.replace(target);
    }
  }, [isAuthenticated, isLoading, profile, user, router]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);
  
  // ... rest of component
}
```

**Fitur Kunci:**
- **Timeout mechanism** - Menunggu 2 detik untuk profile di-load
- **Proper cleanup** - Clear timeout saat unmount
- **Logging** - Memudahkan debugging

---

## Log Analysis - Bukti Solusi Berhasil

Dari log yang diberikan, terlihat bahwa solusi bekerja dengan baik:

### 1. Session Initialization
```
Initializing session...
Initial session: Found
Session expires in: 3370 seconds
Auth state changed: INITIAL_SESSION Session exists
```
✅ Session berhasil di-load dari storage saat aplikasi start

### 2. Auto-Refresh Started
```
Starting auto-refresh for web...
```
✅ Auto-refresh aktif untuk web platform

### 3. Login Flow
```
Signing in...
Auth state changed: SIGNED_IN Session exists
Sign in successful, session created
Loading profile for user: f01d6440-c599-41d5-a621-7a1375664d98
Profile loaded after sign in
Index: Redirecting to /(owner)/dashboard
```
✅ Login berhasil, profile ter-load, redirect berhasil

### 4. Visibility Change Handler
```
Tab hidden, auto-refresh continues in background
Tab became visible, checking session...
Window focused, checking session...
```
✅ Handler bekerja dengan baik, tidak terlalu agresif

### 5. Session Persistence
- Tidak ada error "Session expired" setelah pindah tab
- Tidak ada redirect ke login setelah pindah tab
- Session tetap valid setelah visibility change

---

## Best Practices yang Diterapkan

### 1. Platform Detection
- Selalu deteksi platform sebelum menggunakan platform-specific APIs
- Gunakan conditional untuk web vs mobile

### 2. Error Handling
- Selalu wrap storage operations dengan try-catch
- Return null/empty pada error, jangan throw
- Log errors untuk debugging

### 3. Throttling & Debouncing
- Throttle visibility change handler (2 detik)
- Skip refresh jika baru ada perubahan session (3 detik)
- Prevent multiple simultaneous refresh calls

### 4. State Synchronization
- Selalu baca dari storage untuk memastikan sinkronisasi
- Update state jika berbeda dengan storage
- Gunakan `onAuthStateChange` sebagai source of truth

### 5. Graceful Degradation
- Fallback mechanism jika refresh gagal
- Multiple attempts untuk mendapatkan session
- Clear session hanya jika benar-benar expired

---

## Testing Checklist

### ✅ Test Cases yang Berhasil
- [x] Login di web → session persist setelah reload
- [x] Login di web → pindah tab → kembali → session tetap ada
- [x] Login di web → minimize browser → maximize → session tetap ada
- [x] Login di web → navigasi ke halaman lain → session tetap ada
- [x] Operasi database bekerja setelah pindah tab/minimize
- [x] Auto-refresh aktif untuk web
- [x] Visibility change handler tidak mengganggu login flow

### 📝 Test Cases untuk Mobile (Future)
- [ ] Login di Android → session persist setelah app restart
- [ ] Login di Android → background app → foreground → session tetap ada
- [ ] AppState management bekerja dengan benar

---

## Dependencies yang Diperlukan

```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@supabase/supabase-js": "^2.83.0",
  "react-native": "0.81.5"
}
```

---

## File-File yang Dimodifikasi

1. **`lib/storage-adapter.ts`** (New) - Platform-aware storage adapter
2. **`lib/supabase.ts`** - Konfigurasi dengan storage adapter
3. **`hooks/use-auth.tsx`** - Auto-refresh, visibility handler, session management
4. **`app/login.tsx`** - Delay sebelum redirect
5. **`app/index.tsx`** - Timeout untuk menunggu profile
6. **`app/_layout.tsx`** - GestureHandlerRootView untuk native

---

## Kesimpulan

Solusi ini berhasil mengatasi masalah session persistence dengan:

1. **Platform-aware storage adapter** - Konsisten antara web dan mobile
2. **Auto-refresh untuk web** - Token refresh otomatis
3. **Optimal visibility handler** - Tidak mengganggu flow, dengan throttling
4. **Robust session management** - Multiple fallback mechanisms
5. **Proper state synchronization** - Selalu sinkron dengan storage

**Hasil:**
- ✅ Session persist setelah pindah tab
- ✅ Session persist setelah reload
- ✅ Operasi database bekerja setelah pindah tab
- ✅ Tidak ada logout otomatis yang tidak diinginkan

---

## Referensi

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

**Dokumen ini dibuat untuk referensi di masa depan dan sebagai dokumentasi solusi yang telah terbukti bekerja.**

