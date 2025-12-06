import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Platform, AppState, type AppStateStatus } from 'react-native';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/lib/utils/role-check';

type UserProfile = {
  id: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  signIn: (payload: { email: string; password: string }) => Promise<{ error: any }>;
  signUp: (payload: { email: string; password: string; fullName: string; role?: UserRole }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshSession: () => Promise<{ session: Session | null; error: any }>;
  ensureValidSession: () => Promise<{ session: Session | null; error: any }>;
  createUserAsAdmin: (payload: { email: string; password: string; fullName: string; role: UserRole }) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadComplete = useRef(false);
  const ensureValidSessionRef = useRef<(() => Promise<{ session: Session | null; error: any }>) | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }
      
      if (data) {
        setProfile(data as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  }, []);

  // Fungsi untuk refresh session secara manual
  // Supabase akan otomatis membaca dari storage adapter (localStorage untuk web, AsyncStorage untuk mobile)
  const refreshSession = useCallback(async () => {
    try {
      console.log('Attempting to refresh session...');
      
      // Langsung coba refresh - Supabase akan otomatis membaca refresh token dari storage adapter
      // Ini lebih reliable karena langsung membaca dari storage, bukan dari memory
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
        
        // Jika refresh gagal karena token expired atau invalid, clear session
        if (
          refreshError.message?.includes('expired') || 
          refreshError.message?.includes('Invalid') ||
          refreshError.message?.includes('refresh_token_not_found') ||
          refreshError.message?.includes('JWT') ||
          refreshError.message?.includes('token') ||
          refreshError.message?.includes('not found')
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
      console.log('No session after refresh, checking storage...');
      const { data: { session: storageSession }, error: getSessionError } = await supabase.auth.getSession();
      
      if (getSessionError) {
        console.error('Error getting session from storage:', getSessionError);
      }
      
      if (storageSession) {
        console.log('Found session in storage');
        setSession(storageSession);
        setUser(storageSession.user ?? null);
        if (storageSession.user) {
          await fetchProfile(storageSession.user.id);
        }
        return { session: storageSession, error: null };
      }

      // Tidak ada session sama sekali
      console.log('No session found in storage');
      setSession(null);
      setUser(null);
      setProfile(null);
      return { session: null, error: new Error('No session to refresh') };
    } catch (error) {
      console.error('Error in refreshSession:', error);
      return { session: null, error };
    }
  }, [fetchProfile]);

  // Fungsi untuk memastikan session valid sebelum operasi database
  const ensureValidSession = useCallback(async () => {
    try {
      // Selalu baca session langsung dari storage untuk memastikan sinkronisasi
      // getSession() akan membaca dari storage adapter yang sudah dikonfigurasi
      const { data: { session: currentSession }, error: getSessionError } = await supabase.auth.getSession();
      
      if (getSessionError) {
        console.error('Error getting session:', getSessionError);
        // Coba refresh sebagai fallback
        return await refreshSession();
      }

      if (!currentSession) {
        // Tidak ada session, coba refresh dulu (mungkin masih ada refresh token di storage)
        console.log('No current session, attempting refresh from storage...');
        const refreshResult = await refreshSession();
        if (refreshResult.session) {
          return refreshResult;
        }
        // Jika refresh gagal, return error
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
            // Update state untuk memastikan sinkronisasi
            if (currentSession.access_token !== session?.access_token) {
              setSession(currentSession);
              setUser(currentSession.user ?? null);
              if (currentSession.user) {
                await fetchProfile(currentSession.user.id);
              }
            }
            return { session: currentSession, error: null };
          }
          // Session sudah expired
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
      // Coba refresh sebagai last resort
      const refreshResult = await refreshSession();
      return refreshResult;
    }
  }, [session, refreshSession, fetchProfile]);

  // Simpan ensureValidSession di ref untuk akses di useEffect
  ensureValidSessionRef.current = ensureValidSession;

  // Initial session loading - harus setelah refreshSession dan ensureValidSession didefinisikan
  useEffect(() => {
    let mounted = true;

    const loadProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!mounted) return;

        if (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
          return;
        }
        
        if (data) {
          setProfile(data as UserProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching profile:', error);
        setProfile(null);
      }
    };

    const completeInitialLoad = () => {
      if (mounted && !initialLoadComplete.current) {
        initialLoadComplete.current = true;
        setIsLoading(false);
      }
    };

    // Get initial session - hanya set isLoading false setelah initial load
    const initializeSession = async () => {
      try {
        console.log('Initializing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
      if (!mounted) return;
        
        if (error) {
          console.error('Error getting initial session:', error);
          // Coba refresh jika ada error
          const refreshResult = await refreshSession();
          if (refreshResult.session) {
            setSession(refreshResult.session);
            setUser(refreshResult.session.user ?? null);
            if (refreshResult.session.user) {
              await loadProfile(refreshResult.session.user.id);
            }
          }
          completeInitialLoad();
          return;
        }

        console.log('Initial session:', session ? 'Found' : 'Not found');
        
        if (session) {
          // Cek apakah session expired
          const expiresAt = session.expires_at;
          if (expiresAt) {
            const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
            console.log(`Session expires in: ${expiresIn} seconds`);
            
            // Jika session akan expired dalam 5 menit atau sudah expired, refresh
            if (expiresIn < 300) {
              console.log('Session expiring soon, refreshing...');
              const refreshResult = await refreshSession();
              if (refreshResult.session) {
                setSession(refreshResult.session);
                setUser(refreshResult.session.user ?? null);
                if (refreshResult.session.user) {
                  await loadProfile(refreshResult.session.user.id);
                }
                completeInitialLoad();
                return;
              }
            }
          }
          
          setSession(session);
          setUser(session.user ?? null);
          if (session.user) {
            await loadProfile(session.user.id);
          }
      } else {
          // Tidak ada session, cek apakah ada refresh token di storage
          // Supabase akan otomatis menggunakan storage adapter yang sudah dikonfigurasi
          // Coba refresh session - ini akan membaca dari storage adapter (localStorage untuk web, AsyncStorage untuk mobile)
          console.log('No session found, attempting to refresh from storage...');
          const refreshResult = await refreshSession();
          if (refreshResult.session) {
            setSession(refreshResult.session);
            setUser(refreshResult.session.user ?? null);
            if (refreshResult.session.user) {
              await loadProfile(refreshResult.session.user.id);
            }
            completeInitialLoad();
            return;
          }
        }
        
        completeInitialLoad();
      } catch (error) {
        console.error('Error initializing session:', error);
        if (mounted) {
          completeInitialLoad();
        }
      }
    };

    initializeSession();

    // Listen for auth changes - JANGAN set isLoading di sini
    // karena ini dipanggil setiap kali ada perubahan auth state (termasuk navigasi)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      // Selalu update session dan user - ini memastikan state selalu sinkron dengan Supabase
      // onAuthStateChange adalah source of truth untuk session state
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      // Hanya set isLoading false jika initial load belum selesai
      // Ini untuk handle edge case jika onAuthStateChange dipanggil sebelum getSession selesai
      completeInitialLoad();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshSession]); // Include refreshSession in dependencies

  // AppState management untuk mobile (start/stop auto refresh)
  useEffect(() => {
    // Hanya untuk mobile (bukan web)
    if (Platform.OS === 'web') {
      return;
    }

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('AppState changed:', nextAppState);
      
      if (nextAppState === 'active') {
        // App menjadi active, start auto refresh dan refresh session
        console.log('App active, starting auto refresh...');
        supabase.auth.startAutoRefresh();
        
        // Refresh session saat app kembali active
        if (ensureValidSessionRef.current) {
          ensureValidSessionRef.current().catch((error) => {
            console.error('Error refreshing session on app active:', error);
          });
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App menjadi background, stop auto refresh untuk menghemat resource
        console.log('App background, stopping auto refresh...');
        supabase.auth.stopAutoRefresh();
      }
    };

    // Set initial state
    const currentState = AppState.currentState;
    if (currentState === 'active') {
      supabase.auth.startAutoRefresh();
    }

    // Listen untuk perubahan AppState
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      // Stop auto refresh saat unmount
      supabase.auth.stopAutoRefresh();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ensureValidSession akan selalu menggunakan versi terbaru karena closure

  const signIn = useCallback(async (payload: { email: string; password: string }) => {
    try {
      console.log('Signing in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
      return { error };
      }
      
      if (data.session) {
        console.log('Sign in successful, session created');
        // Session akan otomatis di-update oleh onAuthStateChange
        // Tapi kita pastikan state di-update juga
        setSession(data.session);
        setUser(data.user ?? null);
        if (data.user) {
          console.log('Loading profile for user:', data.user.id);
          await fetchProfile(data.user.id);
          console.log('Profile loaded after sign in');
        }
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    }
  }, [fetchProfile]);

  const signUp = useCallback(async (payload: { email: string; password: string; fullName: string; role?: UserRole }) => {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
      });

      if (signUpError) return { error: signUpError };
      if (!data.user) return { error: new Error('User creation failed') };

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          full_name: payload.fullName,
          role: payload.role || 'sales',
          phone: null,
          email: payload.email,
        });

      if (profileError) {
        // If profile creation fails, log error (user will need manual cleanup)
        console.error('Profile creation failed:', profileError);
        return { error: profileError };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      }
      
      // Clear local state
      setSession(null);
      setUser(null);
      setProfile(null);
      
      // For web production (static export), ensure localStorage is cleared
      if (typeof window !== 'undefined') {
        // Clear all Supabase-related localStorage items
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith('sb-') || key.startsWith('supabase.auth.token')) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error('Error in signOut:', error);
      // Even if there's an error, clear local state
      setSession(null);
      setUser(null);
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  // Handler untuk visibility change dan auto-refresh untuk web
  useEffect(() => {
    // Hanya jalankan di web browser
    if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Start auto-refresh untuk web saat component mount
    console.log('Starting auto-refresh for web...');
    supabase.auth.startAutoRefresh();

    let isRefreshing = false;
    let lastVisibilityChange = 0;
    let visibilityCheckInterval: NodeJS.Timeout | null = null;
    let lastSessionCheck = 0;

    const handleVisibilityChange = async () => {
      // Jika tab menjadi visible
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
            // Pastikan auto-refresh aktif
            supabase.auth.startAutoRefresh();
            
            // Gunakan ensureValidSession yang lebih gentle daripada refreshSession
            // Ini hanya akan refresh jika session akan expired, tidak force refresh
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
        // Tab menjadi hidden - tetap biarkan auto-refresh berjalan
        console.log('Tab hidden, auto-refresh continues in background');
      }
    };

    // Juga handle focus event sebagai backup (tapi lebih gentle)
    const handleFocus = async () => {
      const now = Date.now();
      // Jangan refresh jika baru saja ada perubahan session
      if (now - lastSessionCheck < 3000) {
        console.log('Skipping focus refresh - recent session change');
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          console.log('Window focused, checking session...');
          // Pastikan auto-refresh aktif
          supabase.auth.startAutoRefresh();
          
          // Gunakan ensureValidSession yang lebih gentle
          if (ensureValidSessionRef.current) {
            await ensureValidSessionRef.current();
          }
        } catch (error) {
          console.error('Error handling focus:', error);
        } finally {
          isRefreshing = false;
        }
      }
    };

    // Periodic check untuk memastikan session tetap valid (setiap 5 menit)
    // Ini sebagai backup jika visibility change tidak terdeteksi
    const startPeriodicCheck = () => {
      if (visibilityCheckInterval) {
        clearInterval(visibilityCheckInterval);
      }
      
      visibilityCheckInterval = setInterval(async () => {
        if (!document.hidden && !isRefreshing) {
          try {
            console.log('Periodic session check...');
            if (ensureValidSessionRef.current) {
              await ensureValidSessionRef.current();
            }
          } catch (error) {
            console.error('Error in periodic session check:', error);
          }
        }
      }, 5 * 60 * 1000); // 5 menit
    };

    // Track session changes untuk menghindari refresh yang terlalu sering
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
        lastSessionCheck = Date.now();
      }
    });

    // Start periodic check
    startPeriodicCheck();

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      // Cleanup
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      if (visibilityCheckInterval) {
        clearInterval(visibilityCheckInterval);
      }
      authSubscription.unsubscribe();
      // Jangan stop auto-refresh saat unmount karena mungkin masih ada tab lain
      // Supabase akan handle cleanup sendiri
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removed refreshSession dependency to avoid re-running

  const createUserAsAdmin = useCallback(async (payload: { email: string; password: string; fullName: string; role: UserRole }) => {
    try {
      // Simpan session owner saat ini
      const currentSession = session;
      const currentUser = user;
      const currentProfile = profile;

      if (!currentSession) {
        return { error: new Error('Tidak ada session aktif') };
      }

      // Simpan access_token dan refresh_token untuk restore
      const ownerAccessToken = currentSession.access_token;
      const ownerRefreshToken = currentSession.refresh_token;

      // Coba gunakan admin API jika tersedia
      try {
        const { data: newUser, error: adminError } = await supabase.auth.admin.createUser({
          email: payload.email,
          password: payload.password,
          email_confirm: true, // Auto-confirm email
        });

        if (adminError) {
          // Jika admin API tidak tersedia, gunakan pendekatan signUp + restore session
          throw adminError;
        }

        if (!newUser.user) {
          return { error: new Error('User creation failed') };
        }

        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: newUser.user.id,
            full_name: payload.fullName,
            role: payload.role,
            phone: null,
            email: payload.email,
          });

        if (profileError) {
          console.error('Profile creation failed:', profileError);
          return { error: profileError };
        }

        // Pastikan session owner masih aktif (admin API tidak mengubah session)
        return { error: null };
      } catch (adminError) {
        // Fallback: gunakan signUp lalu restore session owner
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
        });

        if (signUpError) return { error: signUpError };
        if (!signUpData.user) return { error: new Error('User creation failed') };

        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: signUpData.user.id,
            full_name: payload.fullName,
            role: payload.role,
            phone: null,
            email: payload.email,
          });

        if (profileError) {
          console.error('Profile creation failed:', profileError);
          return { error: profileError };
        }

        // Restore session owner segera setelah membuat user
        if (ownerAccessToken && ownerRefreshToken) {
          const { data: restoredSession, error: restoreError } = await supabase.auth.setSession({
            access_token: ownerAccessToken,
            refresh_token: ownerRefreshToken,
          });

          if (restoreError) {
            console.error('Error restoring session:', restoreError);
            return { error: new Error('Gagal mengembalikan session. Silakan login ulang.') };
          }

          // Update state dengan session yang di-restore
          if (restoredSession.session) {
            setSession(restoredSession.session);
            setUser(restoredSession.user);
            // Reload profile owner
            if (restoredSession.user) {
              await fetchProfile(restoredSession.user.id);
            }
          }
        } else {
          return { error: new Error('Tidak dapat mengembalikan session') };
        }

        return { error: null };
      }
    } catch (error) {
      return { error };
    }
  }, [session, user, profile, fetchProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session && user),
      isLoading,
      user,
      session,
      profile,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      refreshSession,
      ensureValidSession,
      createUserAsAdmin,
    }),
    [session, user, profile, isLoading, signIn, signUp, signOut, refreshProfile, refreshSession, ensureValidSession, createUserAsAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}


