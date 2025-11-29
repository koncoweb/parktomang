# Firebase Setup & Migration Guide

## 🔥 Migrasi dari MongoDB + JWT ke Firebase

Aplikasi telah di-migrate untuk menggunakan **Firebase Authentication** dan **Firestore Database** secara penuh. Backend FastAPI dan MongoDB sudah tidak digunakan lagi.

---

## 📋 Langkah Setup Firebase (WAJIB)

### 1. Setup Authentication di Firebase Console

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project: **parokitomang-4f136**
3. Buka **Authentication** > **Sign-in method**
4. Enable **Email/Password** authentication
5. Klik **Save**

### 2. Enable Firestore Database

1. Di Firebase Console, buka **Firestore Database**
2. Klik **Create database**
3. Pilih mode: **Start in production mode** (kita akan set rules nanti)
4. Pilih location: **asia-southeast1** (Singapore - terdekat dengan Indonesia)
5. Klik **Enable**

### 3. Setup Firestore Security Rules

Paste rules berikut di **Firestore Database** > **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin'];
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'superadmin';
    }
    
    // Users collection - only admins can read/write
    match /users/{userId} {
      allow read: if isAdmin();
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isSuperAdmin(); // Only superadmin can delete users
    }
    
    // Settings collection - admins can read/write
    match /settings/{settingId} {
      allow read: if true; // Public read for app settings
      allow write: if isAdmin();
    }
    
    // Pages collection
    match /pages/{pageId} {
      allow read: if true; // Public read
      allow write: if isAdmin(); // Only admins can create/update/delete pages
    }
  }
}
```

### 4. Create Superadmin Account (MANUAL)

**IMPORTANT**: Buat akun superadmin secara manual di Firebase Console:

1. Buka **Authentication** > **Users**
2. Klik **Add user**
3. Email: `joni@email.com`
4. Password: `joni2#Marjoni`
5. Klik **Add user**

**Note**: Saat superadmin login pertama kali, aplikasi akan otomatis membuat profile di Firestore dengan role 'superadmin'.

---

## 📁 Struktur Database Firestore

### Collections:

#### 1. **users** - User profiles
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  role: 'superadmin' | 'admin';
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### 2. **settings** - App settings
```typescript
{
  appName: string;
  parokiName: string;
  headerText: string;
  footerText: string;
  logoBase64?: string;        // Logo as base64
  iconBase64?: string;         // PWA icon as base64
  faviconBase64?: string;      // Favicon as base64
  primaryColor: string;
  secondaryColor: string;
  updatedAt: timestamp;
}
```

#### 3. **pages** - Dynamic pages
```typescript
{
  id: string;
  title: string;
  slug: string;
  icon: string;
  type: 'static' | 'webview' | 'youtube_video' | 'youtube_channel' | 'data_table';
  order: number;
  active: boolean;
  
  // Type-specific fields
  richTextContent?: string;              // For static pages
  webviewUrl?: string;                   // For webview pages
  youtubeVideos?: Array<{...}>;          // For youtube video list
  youtubeChannelId?: string;             // For youtube channel
  tableTitle?: string;                   // For data table
  tableColumns?: Array<{...}>;           // For data table
  tableData?: Array<Record<string, any>>; // For data table
  
  createdAt: timestamp;
  updatedAt: timestamp;
  createdBy: string; // User UID
}
```

---

## 🔧 Files yang Sudah Dibuat

### Config & Services:

1. **`/frontend/config/firebase.ts`**
   - Firebase initialization
   - Auth & Firestore setup
   - Cross-platform persistence (AsyncStorage untuk mobile, localStorage untuk web)

2. **`/frontend/services/auth.service.ts`**
   - Login, logout, register
   - User profile management
   - Auto-create profile on first login
   - Support untuk superadmin

3. **`/frontend/services/settings.service.ts`**
   - Get/update app settings
   - Initialize default settings
   - Menyimpan logo/icon sebagai base64 di Firestore

4. **`/frontend/services/pages.service.ts`**
   - CRUD operations untuk pages
   - Support semua page types
   - Query by slug, get active pages

5. **`/frontend/services/users.service.ts`**
   - Get all users
   - Update user roles
   - Delete users (dengan proteksi superadmin)

### Updated:

6. **`/frontend/contexts/AuthContext.tsx`**
   - Migrated ke Firebase Auth
   - Real-time auth state listener
   - Profile fetching dari Firestore

---

## 🚀 Testing Firebase Integration

### Test 1: Login Superadmin

```typescript
// Di admin login page, test dengan:
Email: joni@email.com
Password: joni2#Marjoni
```

Setelah login, cek Firebase Console > Firestore Database. Harus ada collection `users` dengan document UID superadmin yang berisi profile.

### Test 2: Default Settings

Settings default akan di-create otomatis saat app pertama kali load. Cek di Firestore collection `settings`.

---

## 📝 Next Steps - Admin Panel UI

Setelah Firebase setup selesai, berikut yang perlu diimplementasi:

### Phase 1: Admin Dashboard Navigation
- [ ] Sidebar menu dengan navigasi ke:
  - Settings Umum
  - Manajemen Halaman
  - Manajemen User

### Phase 2: Settings Umum Page
- [ ] Form untuk edit app settings
- [ ] Upload logo/icon (convert ke base64)
- [ ] Color picker untuk primary/secondary color
- [ ] Preview changes

### Phase 3: Page Management
- [ ] List semua pages dengan table
- [ ] Create new page dengan form
- [ ] Edit page dengan modal/drawer
- [ ] Delete page dengan confirmation
- [ ] Drag & drop untuk reorder pages
- [ ] Toggle active/inactive
- [ ] Rich text editor untuk static pages (react-quill atau similar)
- [ ] YouTube video ID input
- [ ] Data table builder

### Phase 4: User Management
- [ ] List all users (except current user)
- [ ] Register new admin button
- [ ] Delete user (dengan confirmation)
- [ ] Role badge (superadmin/admin)
- [ ] Cannot delete superadmin

---

## ⚠️ Important Notes

1. **No Backend Required**: Semua operasi langsung ke Firebase dari client-side
2. **Security**: Firestore rules protect data based on user roles
3. **Base64 Storage**: Karena free plan, images disimpan sebagai base64 di Firestore (bukan Firebase Storage)
4. **Offline Support**: Firebase automatically handles offline mode
5. **Real-time**: Firestore support real-time listeners (bisa digunakan untuk live updates)

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/network-request-failed)"
- Cek internet connection
- Pastikan Firebase project config benar

### Error: "Missing or insufficient permissions"
- Cek Firestore security rules
- Pastikan user sudah login
- Verify user role di Firestore

### Superadmin tidak bisa login
- Pastikan akun sudah dibuat di Firebase Console
- Cek email & password
- Cek Firebase Authentication enabled

### Settings tidak muncul
- Cek apakah `initializeDefaultSettings()` dipanggil di AuthContext
- Verify di Firebase Console > Firestore

---

## 📚 Firebase Documentation Links

- [Firebase Auth Docs](https://firebase.google.com/docs/auth/web/start)
- [Firestore Docs](https://firebase.google.com/docs/firestore/quickstart)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**Status**: ✅ Firebase configured, Services created, AuthContext migrated
**Next**: Setup Firebase Console + Implement Admin Panel UI
