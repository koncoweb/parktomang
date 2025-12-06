// Mock untuk TurboModuleRegistry
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn((name) => {
    // Return mock untuk TurboModule yang diminta
    return {
      show: jest.fn(),
      reload: jest.fn(),
      debugRemotely: jest.fn(),
      setProfilingEnabled: jest.fn(),
      setHotLoadingEnabled: jest.fn(),
      getConstants: jest.fn(() => ({})),
    };
  }),
  get: jest.fn((name) => {
    return {
      show: jest.fn(),
      reload: jest.fn(),
      debugRemotely: jest.fn(),
      setProfilingEnabled: jest.fn(),
      setHotLoadingEnabled: jest.fn(),
      getConstants: jest.fn(() => ({})),
    };
  }),
}));

// Mock untuk NativeDeviceInfo (TurboModule)
jest.mock('react-native/src/private/specs_DEPRECATED/modules/NativeDeviceInfo', () => ({
  getConstants: jest.fn(() => ({
    Dimensions: {
      window: {
        fontScale: 2,
        height: 1334,
        scale: 2,
        width: 750,
      },
      screen: {
        fontScale: 2,
        height: 1334,
        scale: 2,
        width: 750,
      },
    },
  })),
}));

// Mock untuk React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios || obj.default),
    },
  };
});

// Mock untuk react-native/jest/setup.js sebelum di-load
// Ini mencegah file setup React Native yang berisi ES modules di-load
jest.mock('react-native/jest/setup', () => {
  // Set global flags yang diperlukan
  global.IS_REACT_ACT_ENVIRONMENT = true;
  global.IS_REACT_NATIVE_TEST_ENVIRONMENT = true;
  
  // Return empty object karena setup sudah di-handle di jest.setup.js
  return {};
}, { virtual: true });

// Mock untuk Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {},
  },
}));

// Mock untuk AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock untuk Supabase (hanya untuk test yang tidak spesifik test supabase)
// Test spesifik untuk supabase akan menggunakan mock sendiri
if (!process.env.TEST_SUPABASE) {
  jest.mock('@/lib/supabase', () => ({
    supabase: {
      auth: {
        getSession: jest.fn(),
        refreshSession: jest.fn(),
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        onAuthStateChange: jest.fn(() => ({
          data: { subscription: { unsubscribe: jest.fn() } },
        })),
        startAutoRefresh: jest.fn(),
        stopAutoRefresh: jest.fn(),
        setSession: jest.fn(),
        admin: {
          createUser: jest.fn(),
        },
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      })),
    },
    handleSupabaseError: jest.fn(),
  }));
}

// Mock untuk expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  usePathname: () => '/',
  Redirect: ({ href }) => null,
  Stack: () => null,
}));

// Setup global test environment
global.__DEV__ = true;

