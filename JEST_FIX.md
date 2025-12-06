# Solusi Masalah Jest dengan React Native Setup File

## Masalah
File `node_modules/react-native/jest/setup.js` berisi TypeScript syntax dan ES modules yang tidak bisa di-parse oleh Babel dalam konteks Jest, menyebabkan error saat menjalankan tests.

## Solusi yang Paling Aman dan Kompatibel

Solusi yang direkomendasikan adalah menggunakan konfigurasi yang:
1. Mengecualikan file setup React Native dari transform dengan `transformIgnorePatterns`
2. Menggunakan `moduleNameMapper` untuk mock file tersebut jika masih di-load
3. Override `setupFiles` untuk menggunakan hanya jest-expo setup tanpa React Native setup

### Konfigurasi yang Sudah Diterapkan

File `jest.config.js` sudah dikonfigurasi dengan:
- `transformIgnorePatterns` yang mengecualikan file setup React Native
- `moduleNameMapper` yang mock file setup React Native
- `setupFiles` yang hanya menggunakan jest-expo setup

### Alternatif Solusi (Jika Masih Bermasalah)

Jika masalah masih terjadi, coba salah satu solusi berikut:

#### Solusi 1: Update Dependencies
```bash
npm install --save-dev react-native@latest jest-expo@latest --legacy-peer-deps
```

#### Solusi 2: Gunakan Konfigurasi Manual Tanpa Preset
Hapus `preset: 'jest-expo'` dan gunakan konfigurasi manual:

```javascript
module.exports = {
  // Hapus preset dan gunakan konfigurasi manual
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { presets: ['babel-preset-expo'] },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/react-native/jest/setup\\.js$',
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*)',
  ],
  // ... konfigurasi lainnya
};
```

#### Solusi 3: Patch File Setup React Native
Jika solusi di atas tidak bekerja, buat patch untuk file setup React Native:

1. Install `patch-package`:
```bash
npm install --save-dev patch-package postinstall-postinstall
```

2. Edit file `node_modules/react-native/jest/setup.js` dan hapus/komentari bagian yang bermasalah

3. Buat patch:
```bash
npx patch-package react-native
```

4. Tambahkan script di `package.json`:
```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

## Status Saat Ini

Konfigurasi saat ini menggunakan solusi yang paling aman dengan:
- ✅ `transformIgnorePatterns` untuk mengecualikan file setup React Native
- ✅ `moduleNameMapper` untuk mock file tersebut
- ✅ `setupFiles` yang hanya menggunakan jest-expo setup
- ✅ Mock file di `__mocks__/react-native-jest-setup.js`

Jika masih ada masalah, coba salah satu alternatif solusi di atas.

