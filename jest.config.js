// Solusi paling aman dan kompatibel: 
// 1. Gunakan transformIgnorePatterns untuk mengecualikan file setup React Native
// 2. Gunakan moduleNameMapper untuk mock file tersebut jika masih di-load
// 3. Override setupFiles untuk menggunakan hanya jest-expo setup tanpa React Native setup
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    // PENTING: Exclude file setup React Native, polyfills, dan mocks yang berisi TypeScript/Flow syntax
    // Pattern ini harus di awal untuk memastikan file tersebut tidak di-transform
    'node_modules/react-native/jest/setup\\.js$',
    'node_modules/react-native/jest/mocks/.*',
    'node_modules/@react-native/js-polyfills/.*',
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@supabase/.*)',
  ],
  // Override setupFiles untuk mencegah react-native/jest-preset memuat file setup React Native
  // Kita hanya menggunakan jest-expo setup dan jest.setup.js kita sendiri
  setupFiles: [
    // Skip react-native/jest/setup.js dengan menggunakan jest-expo setup saja
    require.resolve('jest-expo/src/preset/setup.js'),
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Mock file setup React Native jika masih di-load oleh dependency lain
    '^react-native/jest/setup$': '<rootDir>/__mocks__/react-native-jest-setup.js',
    '^react-native/jest/setup\\.js$': '<rootDir>/__mocks__/react-native-jest-setup.js',
    // Mock file error-guard yang berisi Flow/TypeScript syntax
    '^@react-native/js-polyfills/error-guard$': '<rootDir>/__mocks__/react-native-jest-setup.js',
    '^@react-native/js-polyfills/error-guard\\.js$': '<rootDir>/__mocks__/react-native-jest-setup.js',
    // Mock expo-modules-core/build/Refs jika tidak ada
    '^expo-modules-core/build/Refs$': '<rootDir>/__mocks__/expo-modules-core-refs.js',
    // Mock expo-modules-core/build/web/index.web jika tidak ada
    '^expo-modules-core/build/web/index\\.web$': '<rootDir>/__mocks__/expo-modules-core-web.js',
    // Mock expo/build/winter jika tidak ada
    '^expo/build/winter$': '<rootDir>/__mocks__/expo-winter.js',
  },
  testEnvironment: 'jsdom',
};

