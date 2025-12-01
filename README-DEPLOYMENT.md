# Panduan Deployment ke EAS Hosting

Dokumen ini menjelaskan langkah-langkah untuk mendeploy aplikasi networkasro-app ke EAS Hosting.

## ✅ Prerequisites

1. **EAS CLI** harus sudah terinstall:
   ```bash
   npm install -g eas-cli
   ```

2. **Akun Expo** harus sudah terdaftar dan login:
   ```bash
   eas login
   ```

3. **Environment Variables** harus sudah di-setup di EAS:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 📋 Checklist Kesiapan

### Konfigurasi Project
- [x] ✅ `app.json` sudah dikonfigurasi dengan `expo.web.output: "static"`
- [x] ✅ Expo Router sudah terinstall dan dikonfigurasi
- [x] ✅ Dependencies React Native Web sudah tersedia
- [x] ✅ Script deployment sudah ditambahkan di `package.json`
- [x] ✅ File `eas.json` sudah dibuat
- [x] ✅ Export lokal berhasil tanpa error

### Setup Environment Variables

Environment variables harus di-setup di EAS sebelum deployment. Ada 2 cara:

#### Cara 1: Via EAS Dashboard
1. Login ke [expo.dev](https://expo.dev)
2. Pilih project **networkasro-app**
3. Navigate ke **Settings** > **Environment Variables**
4. Tambahkan:
   - `EXPO_PUBLIC_SUPABASE_URL` = URL Supabase project Anda
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = Anon key dari Supabase project Anda

#### Cara 2: Via EAS CLI
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "YOUR_SUPABASE_URL"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_SUPABASE_ANON_KEY"
```

### Setup Supabase CORS

Supabase CORS settings harus dikonfigurasi untuk mengizinkan domain EAS Hosting:

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Navigate ke **Settings** > **API**
4. Di bagian **Additional Allowed Origins**, tambahkan:
   - `https://*.expo.dev`
   - Atau domain spesifik yang diberikan oleh EAS Hosting setelah deployment pertama

## 🚀 Deployment Steps

### 1. Test Export Lokal (Recommended)

Sebelum deploy, test export lokal terlebih dahulu:

```bash
npm run export:web
```

Ini akan mengexport project ke folder `dist/`. Pastikan tidak ada error.

### 2. Deploy ke EAS Hosting

#### Deploy dengan script otomatis:
```bash
npm run deploy:web
```

Script ini akan:
1. Export project ke folder `dist/`
2. Deploy ke EAS Hosting

#### Atau deploy manual:
```bash
# Export terlebih dahulu
npm run export:web

# Kemudian deploy
npm run deploy
```

### 3. First Deployment

Pada deployment pertama, Anda akan diminta untuk:
- Memilih subdomain preview untuk project Anda
- Setup environment variables jika belum

Setelah deployment selesai, CLI akan menampilkan:
- URL preview deployment (misalnya: `https://your-project-xxx.expo.dev`)
- Link ke detail deployment di EAS Dashboard

### 4. Production Deployment

Setelah preview deployment berhasil, promote ke production:

1. Akses EAS Dashboard: [expo.dev](https://expo.dev)
2. Pilih project **networkasro-app**
3. Navigate ke **Hosting** > **Deployments**
4. Pilih deployment yang ingin dipromote
5. Klik **Promote to Production**
6. Pilih atau buat production alias

## 📝 Scripts yang Tersedia

### `npm run export:web`
Export project untuk platform web ke folder `dist/`

### `npm run deploy`
Deploy ke EAS Hosting (harus export terlebih dahulu)

### `npm run deploy:web`
Export dan deploy dalam satu command (recommended)

## 🔍 Troubleshooting

### Error: Missing Supabase environment variables

**Solusi:**
1. Pastikan environment variables sudah di-setup di EAS
2. Verifikasi nama variable: `EXPO_PUBLIC_SUPABASE_URL` dan `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Pull environment variables untuk verifikasi:
   ```bash
   eas env:pull --environment production
   ```

### Error: Supabase connection failed

**Solusi:**
1. Verifikasi Supabase CORS settings sudah mengizinkan domain EAS Hosting
2. Pastikan Supabase project masih aktif
3. Check Supabase dashboard untuk error logs

### Error saat export lokal

**Solusi:**
1. Clear cache:
   ```bash
   npx expo export --platform web --clear
   ```
2. Delete folder `dist/` dan coba lagi
3. Check error messages untuk detail masalah

### Routing tidak berfungsi di production

**Solusi:**
1. Pastikan `expo.web.output: "static"` sudah dikonfigurasi di `app.json`
2. Pastikan menggunakan `expo-router` untuk routing
3. Check bahwa semua routes sudah di-generate saat export

## 📚 Referensi

- [EAS Hosting Documentation](https://docs.expo.dev/eas/hosting/introduction/)
- [EAS Hosting Get Started](https://docs.expo.dev/eas/hosting/get-started/)
- [EAS Hosting Environment Variables](https://docs.expo.dev/eas/hosting/environment-variables/)
- [Expo Router Static Rendering](https://docs.expo.dev/router/reference/static-rendering/)

## 📞 Support

Jika mengalami masalah, silakan:
1. Check EAS Dashboard untuk error logs
2. Review dokumentasi EAS Hosting
3. Contact Expo support jika diperlukan

