# Dokumentasi Unit Testing

## 📋 Ringkasan

Unit testing telah disiapkan untuk proyek Network ASRO dengan menggunakan Jest dan React Native Testing Library.

## 🛠 Dependencies yang Terinstall

- `jest@^29.7.0` - Testing framework
- `@testing-library/react-native@^12.4.3` - Testing utilities untuk React Native
- `jest-expo@~51.0.0` - Jest preset untuk Expo
- `@types/jest@^29.5.12` - Type definitions untuk Jest
- `react-test-renderer@19.1.0` - Renderer untuk testing React components
- `jest-environment-jsdom` - Environment untuk testing di browser-like environment

## 📁 Struktur Test Files

Unit tests telah dibuat untuk:

1. **lib/utils/date-utils.test.ts** - Test untuk utility functions formatDate, formatDateTime, formatCurrency, dll
2. **lib/utils/role-check.test.ts** - Test untuk permission checking functions (hasPermission, isOwner, isAdmin, dll)
3. **components/ui/button.test.tsx** - Test untuk Button component
4. **lib/__tests__/supabase.test.ts** - Test untuk handleSupabaseError function

## ⚙️ Konfigurasi

### jest.config.js
Konfigurasi Jest dengan preset jest-expo, module name mapping untuk path alias `@/*`, dan coverage collection.

### jest.setup.js
Setup file untuk mocking:
- React Native modules
- Expo modules
- AsyncStorage
- Supabase
- Expo Router

## 🚀 Menjalankan Tests

```bash
# Menjalankan semua tests
npm test

# Menjalankan tests dengan watch mode
npm run test:watch

# Menjalankan tests dengan coverage report
npm run test:coverage
```

## ⚠️ Catatan Penting

Saat ini ada masalah dengan konfigurasi jest-expo yang mencoba memparse file setup React Native yang berisi TypeScript syntax. Masalah ini perlu diselesaikan dengan:

1. Update versi jest-expo atau react-native
2. Atau menggunakan konfigurasi Jest manual tanpa preset jest-expo
3. Atau mengecualikan file setup React Native dari transform

## 📝 Test Coverage

Tests mencakup:
- ✅ Utility functions (date-utils, role-check)
- ✅ Component testing (Button)
- ✅ Error handling (handleSupabaseError)

## 🔧 Troubleshooting

Jika mengalami masalah dengan setup, coba:

1. Hapus `node_modules` dan `package-lock.json`
2. Install ulang dependencies: `npm install`
3. Clear Jest cache: `npm test -- --clearCache`
4. Pastikan versi dependencies kompatibel

