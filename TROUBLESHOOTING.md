# 🐛 Troubleshooting Guide - Admin Panel Issues

## Issue 1: Profile Tidak Auto-Create di Firestore ❌

### Gejala:
- Login berhasil di Firebase Auth
- Redirect ke dashboard
- Dashboard kosong
- Tidak ada data di collection "users" di Firestore

### Root Cause:
Collection name adalah **"users"** bukan "profiles". Dan kemungkinan Firestore rules menolak write operation.

### Solution:

#### Step 1: Cek Firestore Rules
Pastikan Firestore rules sudah benar:

1. Go to: https://console.firebase.google.com/project/parokitomang-4f136/firestore/rules
2. Rules harus memperbolehkan authenticated users untuk write ke collection `users`
3. Paste rules berikut dan klik **Publish**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin'];
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'superadmin';
    }
    
    // Allow authenticated users to create their own profile on first login
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAdmin() || request.auth.uid == userId;
      allow delete: if isSuperAdmin();
    }
    
    match /settings/{settingId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isSuperAdmin();
    }
    
    match /pages/{pageId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

**KEY CHANGE**: `allow create: if isAuthenticated() && request.auth.uid == userId;` - memperbolehkan user membuat profile sendiri saat first login.

#### Step 2: Cek Browser Console
1. Buka browser DevTools (F12)
2. Go to Console tab
3. Coba login lagi
4. Cari log messages:
   - `[Auth] Attempting login for: joni@email.com`
   - `[Auth] Login successful, UID: xxx`
   - `[Auth] User profile exists: false` (jika belum ada)
   - `[Auth] Creating new profile for: joni@email.com`
   - `[Auth] Profile created successfully` ✅

Jika ada error di sini, akan terlihat detail error-nya.

#### Step 3: Manual Create Profile (Temporary Workaround)
Jika auto-create tetap gagal, buat profile manual di Firestore Console:

1. Go to: https://console.firebase.google.com/project/parokitomang-4f136/firestore/data
2. Create collection: `users`
3. Get UID dari Firebase Authentication (lihat di Authentication > Users)
4. Create document dengan Document ID = UID superadmin
5. Add fields:
   ```
   uid: (string) = [UID dari Firebase Auth]
   email: (string) = joni@email.com
   displayName: (string) = Super Admin
   role: (string) = superadmin
   createdAt: (timestamp) = [now]
   updatedAt: (timestamp) = [now]
   ```
6. Save
7. Refresh halaman login dan coba login lagi

---

## Issue 2: Dashboard Kosong ⬜

### Gejala:
- Login berhasil
- Redirect ke `/adm/dashboard`
- Halaman kosong / blank screen
- Tidak ada error di console

### Possible Causes:

#### Cause 1: Profile Tidak Ditemukan
**Check**: Apakah ada profile di Firestore collection `users`?

**Solution**: Lihat Issue 1 di atas

#### Cause 2: Auth Context Loading
**Check**: Browser console logs:
- `[Dashboard] User: joni@email.com`
- `[Dashboard] Profile: undefined` ❌

**Solution**: 
- Clear browser cache (Ctrl+Shift+Del)
- Logout dan login lagi
- Cek Firestore rules (Issue 1, Step 1)

#### Cause 3: Component Rendering Issue
**Check**: Browser console for React errors

**Solution**:
1. Open browser DevTools
2. Check Console for errors
3. Check Network tab untuk failed requests
4. Try hard refresh: Ctrl+Shift+R

---

## Issue 3: "Permission Denied" Error 🚫

### Gejala:
Error di console: `FirebaseError: Missing or insufficient permissions`

### Root Cause:
Firestore security rules terlalu ketat atau salah

### Solution:

Update Firestore rules dengan rules yang sudah diperbaiki di Issue 1, Step 1.

**Key Points:**
1. `allow create: if isAuthenticated()` untuk collection `users` - allows auto-create profile
2. `allow create: if isAuthenticated()` untuk collection `settings` - allows auto-init settings
3. Check `exists()` before `get()` untuk avoid "document doesn't exist" error

---

## Issue 4: Settings Tidak Load

### Gejala:
- Dashboard muncul
- Klik "Settings Umum"
- Form tidak muncul atau stuck loading

### Solution:

#### Check 1: Firestore Rules
Settings collection needs write permission for authenticated users:
```javascript
match /settings/{settingId} {
  allow read: if true;
  allow create: if isAuthenticated();
  allow update: if isAuthenticated();
}
```

#### Check 2: Default Settings Initialization
Settings akan auto-create saat app pertama load. Check:
1. Firestore console
2. Collection: `settings`
3. Document: `app_settings`

Jika tidak ada, akan dibuat otomatis oleh `AuthContext` saat app load.

#### Manual Create (if needed):
```
Document ID: app_settings
Fields:
  appName: (string) = "Paroki Tomang"
  parokiName: (string) = "Paroki Santa Maria Bunda Karmel (MBK)"
  headerText: (string) = "Paroki Tomang"
  footerText: (string) = "Paroki Santa Maria Bunda Karmel (MBK)\nTomang - Jakarta Barat"
  primaryColor: (string) = "#8B4513"
  secondaryColor: (string) = "#D2691E"
  updatedAt: (timestamp) = [now]
```

---

## Issue 5: Can't Upload Images

### Gejala:
- Click image upload area
- Nothing happens atau error

### Solution:

#### On Mobile:
1. Grant photo library permission saat diminta
2. Jika permission denied, go to phone Settings > App > Permissions
3. Enable "Photos" permission

#### On Web:
1. expo-image-picker works on web with file input
2. Check browser console for errors
3. Make sure image size < 2MB (recommended)
4. Supported formats: JPG, PNG

#### Common Error:
```
Error: Permission denied
```
**Solution**: Grant permission atau refresh page dan try again

---

## Debugging Checklist ✅

When something doesn't work, check in this order:

1. ✅ **Browser Console** (F12) - Look for errors
   - Red errors = something broken
   - Look for `[Auth]` or `[Dashboard]` logs

2. ✅ **Firestore Rules** - Make sure they're published
   - Go to Firestore > Rules tab
   - Click "Publish" after editing

3. ✅ **Firebase Authentication** - Verify account exists
   - Go to Authentication > Users
   - Should see `joni@email.com`

4. ✅ **Firestore Data** - Check collections exist
   - `users` collection with superadmin profile
   - `settings` collection with app_settings doc

5. ✅ **Network Tab** - Check API calls
   - Look for failed Firebase API requests
   - 403 = permission denied
   - 404 = document not found

6. ✅ **Clear Cache** - Often fixes weird issues
   - Ctrl+Shift+Del
   - Clear "Cached images and files"
   - Reload page

7. ✅ **Try Incognito** - Rules out extension conflicts
   - Open incognito/private window
   - Try login again

---

## Quick Fixes 🔧

### Fix 1: Clear Everything
```bash
# Browser
Ctrl+Shift+Del -> Clear cache -> Reload

# Or try incognito mode
```

### Fix 2: Logout & Login Again
1. Click logout button
2. Clear browser cache
3. Go to `/adm`
4. Login with credentials

### Fix 3: Manual Profile Creation
See Issue 1, Step 3 above

### Fix 4: Check Firestore Rules
Most common issue! Make sure rules are correct and **Published**.

---

## Still Not Working? 🆘

### Get Debug Info:

1. **Browser Console Logs**
   - Take screenshot of console errors
   - Look for `[Auth]` logs during login

2. **Firestore Structure**
   - Take screenshot of Firestore collections
   - Check if `users` collection exists
   - Check if profile document exists

3. **Network Errors**
   - Open DevTools > Network tab
   - Filter by "firestore"
   - Look for 403/404 errors
   - Check request payload

4. **Firebase Console**
   - Check Authentication > Users
   - Check Firestore > Data
   - Check Firestore > Rules (published?)

---

## Expected Working State ✅

When everything works correctly:

### Browser Console Logs:
```
[Auth] Attempting login for: joni@email.com
[Auth] Login successful, UID: xxx
[Auth] User profile exists: true (or false on first login)
[Auth] Profile data: {uid, email, role: 'superadmin'}
[Dashboard] User: joni@email.com
[Dashboard] Profile: {uid, email, displayName, role}
```

### Firestore Structure:
```
📁 users (collection)
  └─ 📄 [UID] (document)
      ├─ uid: "xxx"
      ├─ email: "joni@email.com"
      ├─ displayName: "Super Admin"
      ├─ role: "superadmin"
      ├─ createdAt: timestamp
      └─ updatedAt: timestamp

📁 settings (collection)
  └─ 📄 app_settings (document)
      ├─ appName: "Paroki Tomang"
      ├─ parokiName: "..."
      ├─ primaryColor: "#8B4513"
      └─ ...
```

### Dashboard Display:
- ✅ Sidebar with 4 menu items
- ✅ Profile card with email and role badge
- ✅ Stats cards (even if showing 0)
- ✅ Can navigate between pages
- ✅ Settings form loads when clicked

---

**Last Updated**: After fixing auto-create profile issue
**Status**: Enhanced error handling and logging
