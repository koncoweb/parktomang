# Aplikasi Paroki Tomang 🏛️

Aplikasi hybrid mobile-web untuk Paroki Santa Maria Bunda Karmel Tomang, Jakarta Barat.

![Platform](https://img.shields.io/badge/Platform-iOS%20|%20Android%20|%20Web-blue)
![Framework](https://img.shields.io/badge/Framework-Expo-000020?logo=expo)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)

## ✨ Fitur Utama

### MVP v1.0
- ✅ **Homepage SuperApp Style** - Slider full-width + Grid menu icons yang modern
- ✅ **5 Dummy Sliders** - Auto-play slider dengan pagination dots
- ✅ **6 Menu Icons** - Grid layout yang sleek dan modern:
  - Misa Gereja & Intensi Misa
  - Paroki Tomang - Gereja MBK
  - Pelayanan Gereja MBK
  - Renungan Harian Katolik
  - Kegiatan MBK Akan Datang
  - Kontak & Informasi
- ✅ **Admin Panel** - Login system dengan authentication
  - Email: `joni@email.com`
  - Password: `joni2#Marjoni`
- ✅ **Cross-Platform** - Berjalan di iOS, Android, dan Web
- ✅ **PWA Ready** - Bisa di-install sebagai Progressive Web App
- ✅ **Modern UI** - Desain modern dengan color scheme coklat/orange

## 🎨 Design Philosophy

- **Modern & Sleek** - Interface yang bersih dan mudah digunakan
- **Touch-Friendly** - Optimized untuk mobile dengan touch targets yang besar
- **Responsive** - Adaptif di berbagai ukuran layar
- **Accessible** - Mudah digunakan untuk semua kalangan

## 🛠️ Tech Stack

### Frontend
- **Expo** (React Native) - Cross-platform mobile framework
- **React Native** - UI components
- **TypeScript** - Type-safe development
- **Expo Router** - File-based routing
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **JWT** - Authentication tokens
- **Passlib** - Password hashing

## 📁 Struktur Proyek

```
app/
├── frontend/                 # Aplikasi Expo
│   ├── app/                 # File-based routing
│   │   ├── index.tsx       # Homepage
│   │   ├── adm/            # Admin panel
│   │   │   ├── index.tsx   # Login page
│   │   │   └── dashboard.tsx  # Admin dashboard
│   │   ├── pages/          # Dynamic pages
│   │   │   └── [slug].tsx  # Placeholder pages
│   │   └── _layout.tsx     # Root layout
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication
│   ├── assets/             # Images & fonts
│   └── package.json
├── backend/                 # FastAPI server
│   ├── server.py           # Main application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
└── DEPLOYMENT.md          # Deployment guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB
- Yarn

### Installation

1. **Clone & Install Dependencies**
```bash
# Frontend
cd frontend
yarn install

# Backend
cd ../backend
pip install -r requirements.txt
```

2. **Setup Environment Variables**

Frontend (`frontend/.env`):
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
```

Backend (`backend/.env`):
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=paroki_tomang
JWT_SECRET_KEY=your-secret-key
```

3. **Run Development**

```bash
# Terminal 1 - Backend
cd backend
uvicorn server:app --reload --port 8001

# Terminal 2 - Frontend
cd frontend
yarn start
```

4. **Access**
- Web: http://localhost:3000
- Mobile: Scan QR code dengan Expo Go app
- Admin: http://localhost:3000/adm

## 🔐 Admin Credentials

**Default Super Admin:**
- Email: `joni@email.com`
- Password: `joni2#Marjoni`

⚠️ **IMPORTANT**: Ganti credentials ini untuk production!

## 📱 Features Roadmap

### Phase 2 (Coming Soon)
- [ ] Manajemen Slider Banner dari Admin
- [ ] Upload & Edit banner images (base64)
- [ ] Set link untuk setiap slider (internal/external)
- [ ] Sorting dan activation slider

### Phase 3
- [ ] Manajemen Menu Icons dari Admin
- [ ] Custom icon selection
- [ ] Custom routing untuk setiap menu
- [ ] Add/Remove/Edit menu items

### Phase 4
- [ ] Content Management System
- [ ] Create/Edit Pages & Sub-pages
- [ ] Rich Text Editor
- [ ] Video embed (YouTube, Vimeo)
- [ ] WebView integration
- [ ] Image galleries

### Phase 5
- [ ] User Management
- [ ] Multiple admin accounts
- [ ] Role-based access control
- [ ] Activity logs

### Phase 6
- [ ] Push Notifications
- [ ] Jadwal Misa Management
- [ ] Event Calendar
- [ ] News & Announcements
- [ ] Prayer Requests

## 🧪 Testing

### Manual Testing

**Homepage:**
```bash
curl http://localhost:3000
```

**Backend Health:**
```bash
curl http://localhost:8001/api/health
```

**Admin Login:**
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joni@email.com","password":"joni2#Marjoni"}'
```

## 📦 Deployment

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap deployment ke:
- ✅ Vercel (Web)
- ✅ Netlify (Web)
- ✅ Expo EAS (Mobile)
- ✅ Heroku/Railway (Backend)

## 🎨 Color Scheme

```javascript
Primary:     #8B4513  // Coklat Utama (Brown)
Secondary:   #D2691E  // Orange Coklat (Chocolate)
Background:  #FFF8F0  // Krem Lembut (Cornsilk)
Text:        #5D4037  // Coklat Tua (Brown-900)
Light:       #FFE4C4  // Bisque
Border:      #E0D5C7  // Light Brown
```

## 📸 Screenshots

### Homepage
- Modern slider dengan auto-play
- Grid menu yang sleek
- Responsive design

### Admin Panel
- Secure login system
- Clean dashboard
- Feature roadmap display

### Placeholder Pages
- Coming soon design
- Professional placeholder content

## 🤝 Contributing

This is a custom project for Paroki Tomang. For contributions or suggestions, please contact the project maintainer.

## 📄 License

Proprietary - Paroki Santa Maria Bunda Karmel Tomang

## 📞 Support

For technical support or questions:
- Email: admin@parokitomang.org (example)
- Website: https://parokitomang.org (example)

---

**Made with ❤️ for Paroki Santa Maria Bunda Karmel Tomang**

*Jl. Tomang Raya, Tomang, Grogol Petamburan, Jakarta Barat*
