# Panduan Deployment Aplikasi Paroki Tomang

## 📱 Tentang Aplikasi

Aplikasi hybrid mobile-web untuk Paroki Santa Maria Bunda Karmel Tomang, Jakarta. Dibuat dengan Expo (React Native), cross-platform, dan dapat diinstall sebagai PWA.

## 🚀 Deployment Web ke Vercel/Netlify

### Persiapan

1. Build aplikasi web:
```bash
cd frontend
yarn build:web
```

Ini akan generate static files di folder `dist/`

### Deploy ke Vercel

#### Opsi 1: Via Vercel CLI

```bash
# Install Vercel CLI (jika belum)
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy
cd frontend
yarn build:web
vercel --prod ./dist
```

#### Opsi 2: Via Vercel Dashboard

1. Push code ke GitHub repository
2. Import project di [Vercel Dashboard](https://vercel.com)
3. Set build command: `cd frontend && yarn build:web`
4. Set output directory: `frontend/dist`
5. Deploy!

### Deploy ke Netlify

#### Opsi 1: Via Netlify CLI

```bash
# Install Netlify CLI (jika belum)
npm install -g netlify-cli

# Login ke Netlify
netlify login

# Deploy
cd frontend
yarn build:web
netlify deploy --prod --dir=dist
```

#### Opsi 2: Via Netlify Dashboard

1. Push code ke GitHub repository
2. Import project di [Netlify Dashboard](https://netlify.com)
3. Set build command: `cd frontend && yarn build:web`
4. Set publish directory: `frontend/dist`
5. Deploy!

### Environment Variables untuk Production

Pastikan set environment variables berikut di Vercel/Netlify:

```
EXPO_PUBLIC_BACKEND_URL=https://your-backend-api.com
```

## 📱 Deploy ke Mobile (Expo)

### Preview dengan Expo Go

Aplikasi sudah bisa ditest di Expo Go:

1. Install Expo Go di smartphone (iOS/Android)
2. Scan QR code dari preview
3. Aplikasi akan terbuka di Expo Go

### Build untuk Production

#### Android (APK/AAB)

```bash
cd frontend
eas build --platform android
```

#### iOS (IPA)

```bash
cd frontend
eas build --platform ios
```

*Note: iOS build memerlukan Apple Developer Account*

### PWA Installation

Aplikasi sudah configured sebagai PWA. User bisa install langsung dari browser:

1. Buka aplikasi di browser (Chrome/Safari)
2. Klik menu "Add to Home Screen" atau "Install App"
3. Aplikasi akan terinstall seperti native app

## 🔧 Setup Backend Production

### MongoDB Atlas

1. Buat database di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Dapatkan connection string
3. Set environment variable:
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/paroki_tomang
DB_NAME=paroki_tomang
JWT_SECRET_KEY=your-secret-key-change-this
```

### Deploy Backend

Backend FastAPI bisa di-deploy ke:

#### Heroku
```bash
# Tambahkan Procfile
echo "web: uvicorn server:app --host 0.0.0.0 --port $PORT" > backend/Procfile
```

#### Railway
1. Connect GitHub repo
2. Set root directory ke `backend`
3. Railway akan auto-detect FastAPI

#### DigitalOcean App Platform
1. Create new app
2. Select GitHub repo
3. Set build command: `pip install -r requirements.txt`
4. Set run command: `uvicorn server:app --host 0.0.0.0 --port 8080`

## 👤 Admin Credentials (Production)

**PENTING**: Untuk production, ganti credentials hardcoded di `backend/server.py`:

```python
# Ganti dengan credentials aman
ADMIN_EMAIL = "your-secure-email@domain.com"
ADMIN_PASSWORD = "your-very-secure-password"
```

Atau lebih baik, pindahkan ke environment variables:

```python
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')
```

## 🎨 Customization

### Warna Brand

Edit di `/app/frontend/app/index.tsx` dan files lain:

```javascript
const COLORS = {
  primary: '#8B4513',      // Coklat utama
  secondary: '#D2691E',    // Orange coklat
  background: '#FFF8F0',   // Krem lembut
  text: '#5D4037',         // Coklat teks
};
```

### Logo & Icon

Replace files di `/app/frontend/assets/images/`:
- `icon.png` - App icon (1024x1024)
- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web favicon
- `splash-icon.png` - Splash screen logo

## 📚 API Documentation

Backend API tersedia di: `http://your-backend-url/docs`

Swagger UI akan menampilkan semua available endpoints.

## 🔐 Security Notes

1. Ganti `JWT_SECRET_KEY` dengan value yang aman
2. Enable HTTPS di production
3. Implement rate limiting di backend
4. Validate semua user input
5. Ganti admin credentials hardcoded

## 📞 Support

Untuk bantuan deployment atau issues:
- Check logs di Vercel/Netlify dashboard
- Check console errors di browser
- Test API endpoints dengan Postman/curl

## 🎉 Fitur yang Akan Datang

Dashboard admin akan dilengkapi dengan:
- ✅ Manajemen Slider Banner
- ✅ Pengaturan Menu & Icon  
- ✅ Pembuatan Halaman & Sub-halaman
- ✅ Content Management (Text, Video, WebView)
- ✅ Manajemen User Admin

---

**Made with ❤️ for Paroki Santa Maria Bunda Karmel Tomang**
