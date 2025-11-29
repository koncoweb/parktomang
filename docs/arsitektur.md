# Arsitektur Sistem - Paroki Tomang App

## 📐 Overview Arsitektur

### Stack Technology

```
┌─────────────────────────────────────────────────┐
│           FRONTEND (Expo/React Native)          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   iOS App   │  │ Android App │  │ Web App │ │
│  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│              Firebase Services                   │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ Auth Service │  │  Firestore   │             │
│  │  (Email/Pwd) │  │   Database   │             │
│  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────┘
```

---

## 🏗️ Arsitektur Frontend

### Framework & Libraries

**Core:**
- **Expo SDK 53+** - React Native framework
- **React Native 0.79+** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **Expo Router** - File-based routing system

**State Management:**
- **React Context API** - Global state (Auth)
- **useState/useEffect** - Local component state
- **Firebase Realtime** - Server state sync

**UI Components:**
- **React Native Core** - View, Text, TouchableOpacity, etc.
- **Expo Vector Icons** - Ionicons
- **React Native Safe Area Context** - Safe area handling
- **React Native Pell Rich Editor** - WYSIWYG editor
- **React Native WebView** - For rich text editor

**Firebase SDK:**
- **firebase** v12.6.0 - Official Firebase JS SDK
- **@react-native-async-storage/async-storage** - Auth persistence

---

## 📁 Struktur Folder Frontend

```
frontend/
├── app/                          # File-based routing (Expo Router)
│   ├── index.tsx                 # Homepage (public)
│   ├── _layout.tsx               # Root layout with AuthProvider
│   ├── adm/                      # Admin routes
│   │   ├── index.tsx            # Admin login
│   │   └── dashboard.tsx        # Admin dashboard
│   └── pages/                    # Dynamic pages
│       └── [slug].tsx           # Page detail by slug
│
├── components/                   # Reusable components
│   └── admin/                    # Admin-only components
│       ├── SettingsPage.tsx     # Settings management
│       ├── PagesManagement.tsx  # Page CRUD
│       └── (future) UserManagement.tsx
│
├── contexts/                     # React Context providers
│   └── AuthContext.tsx          # Authentication state
│
├── services/                     # Business logic layer
│   ├── auth.service.ts          # Login, logout, register
│   ├── settings.service.ts      # App settings CRUD
│   ├── pages.service.ts         # Pages CRUD
│   └── users.service.ts         # User management
│
├── config/                       # Configuration files
│   └── firebase.ts              # Firebase initialization
│
├── assets/                       # Static assets
│   ├── images/                  # Icons, splash, etc.
│   └── fonts/                   # Custom fonts
│
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── metro.config.js               # Metro bundler config
```

---

## 🔥 Firebase Architecture

### Services Used

**1. Firebase Authentication**
- Email/Password authentication
- User session management
- Auto-persist with AsyncStorage (mobile) / localStorage (web)

**2. Cloud Firestore**
- NoSQL document database
- Real-time sync capabilities
- Security rules for access control

**Collections:**
```
firestore/
├── users/                    # User profiles
│   └── {uid}/
│       ├── email
│       ├── displayName
│       ├── role (superadmin/admin)
│       ├── createdAt
│       └── updatedAt
│
├── settings/                 # App settings
│   └── app_settings/
│       ├── appName
│       ├── parokiName
│       ├── headerText
│       ├── footerText
│       ├── logoBase64
│       ├── iconBase64
│       ├── faviconBase64
│       ├── primaryColor
│       ├── secondaryColor
│       └── updatedAt
│
└── pages/                    # Dynamic pages
    └── {pageId}/
        ├── title
        ├── slug
        ├── icon
        ├── type (static/webview/youtube_video/youtube_channel/data_table)
        ├── order
        ├── active
        ├── richTextContent (for static)
        ├── webviewUrl (for webview)
        ├── youtubeVideos[] (for youtube_video)
        ├── youtubeChannelId (for youtube_channel)
        ├── tableData (for data_table)
        ├── createdAt
        ├── updatedAt
        └── createdBy
```

---

## 🔒 Security Architecture

### Firestore Security Rules

**Principle:**
- Public read untuk pages & settings
- Authenticated write untuk users & settings
- Admin-only untuk pages management
- Superadmin-only untuk user deletion

**Rule Structure:**
```javascript
function isAuthenticated() → Check if user logged in
function isAdmin() → Check if user has admin/superadmin role
function isSuperAdmin() → Check if user has superadmin role
```

### Authentication Flow

```
┌──────────┐
│  Login   │
│  Page    │
└────┬─────┘
     │ email/password
     ▼
┌──────────────────┐
│ Firebase Auth    │
│ signIn()         │
└────┬─────────────┘
     │ returns user + token
     ▼
┌──────────────────┐
│ Check Firestore  │
│ users/{uid}      │
└────┬─────────────┘
     │
     ├─ Profile exists → Return profile
     │
     └─ No profile → Auto-create profile
                     (superadmin if email matches)
     ▼
┌──────────────────┐
│ AuthContext      │
│ setUser(user)    │
│ setProfile(prof) │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Redirect to      │
│ /adm/dashboard   │
└──────────────────┘
```

---

## 🚦 Data Flow

### Read Operation (e.g., Load Pages)

```
Component          Service              Firestore
    │                 │                     │
    │──getAllPages()─>│                     │
    │                 │─getDocs(query)────>│
    │                 │<──[pages array]────│
    │<──pages[]───────│                     │
    │                 │                     │
   setState()         │                     │
    │                 │                     │
   render()           │                     │
```

### Write Operation (e.g., Create Page)

```
Component          Service              Firestore
    │                 │                     │
    │──createPage()──>│                     │
    │  (formData)     │                     │
    │                 │─setDoc()──────────>│
    │                 │  + serverTimestamp  │
    │                 │  + createdBy        │
    │                 │<──success───────────│
    │<──success───────│                     │
    │                 │                     │
   refresh()          │                     │
```

---

## 🎨 UI/UX Architecture

### Design Pattern: Responsive Admin Panel

**Desktop (width >= 768px):**
- Sidebar always visible
- Content area beside sidebar
- Modal forms with larger width

**Mobile (width < 768px):**
- Sidebar toggled by menu button
- Full-width content area
- Modal forms fill screen
- KeyboardAvoidingView for forms

### Navigation Pattern

```
Public Routes:
  / (index)           → Homepage with menu grid
  /pages/:slug        → Dynamic page content

Auth Routes:
  /adm                → Admin login
  /adm/dashboard      → Admin dashboard (protected)
    ├─ overview       → Dashboard stats
    ├─ settings       → App settings form
    ├─ pages          → Page management
    └─ users          → User management
```

---

## 🔄 State Management Strategy

### Global State (Context)

**AuthContext:**
```typescript
{
  user: User | null,              // Firebase Auth user
  profile: UserProfile | null,    // Firestore user profile
  loading: boolean,               // Initial load state
  login: (email, password) => Promise
  logout: () => Promise
}
```

### Local State (useState)

**Per-component state:**
- Form data
- Modal visibility
- Loading states
- Temporary UI state

### Server State (Firestore)

**Direct queries:**
- Pages list
- Settings data
- User list
- Real-time listeners (future enhancement)

---

## 📊 Performance Considerations

### Optimization Strategies

**1. Code Splitting:**
- File-based routing (automatic code splitting by Expo Router)
- Lazy-loaded admin components

**2. Image Optimization:**
- Base64 for small images (logo, icon, favicon)
- Compression before upload
- No Firebase Storage (free plan limitation)

**3. Query Optimization:**
- Index-based queries in Firestore
- Pagination for large lists (future)
- Cache frequently accessed data

**4. Bundle Size:**
- Tree-shaking enabled
- Minimal dependencies
- Platform-specific code (Platform.OS)

---

## 🔌 Integration Points

### Firebase SDK Integration

**Initialization:**
```typescript
config/firebase.ts
  └─ initializeApp(firebaseConfig)
  └─ getAuth() / initializeAuth()
  └─ getFirestore()
```

**Usage Pattern:**
```typescript
services/*.service.ts
  └─ Import { auth, db } from config/firebase
  └─ Use Firebase SDK methods
  └─ Handle errors
  └─ Return formatted data
```

### Expo Router Integration

**File-based routing:**
- Each file in `app/` becomes a route
- Dynamic routes: `[slug].tsx`
- Layout routes: `_layout.tsx`
- Protected routes: Check auth in component

---

## 🚀 Deployment Architecture

### Frontend Deployment

**Web (Vercel/Netlify):**
```
expo export --platform web
  ↓
  dist/ folder with static files
  ↓
  Upload to Vercel/Netlify
```

**Mobile (Expo EAS):**
```
eas build --platform android/ios
  ↓
  APK/IPA file
  ↓
  Distribute via Play Store/App Store
```

**PWA:**
- Configured in app.json
- Install prompt on web
- Works offline (with service worker)

### Backend (Firebase)

**No server required:**
- Firebase handles all backend logic
- Auto-scaling
- Global CDN
- No maintenance

---

## 📈 Scalability Considerations

### Current Limitations (Free Plan)

**Firestore:**
- 50K reads/day
- 20K writes/day
- 1GB storage
- Solution: Upgrade to Blaze plan when needed

**Authentication:**
- Unlimited users (free tier sufficient)

**Bandwidth:**
- 10GB/month download
- Solution: Optimize images, enable caching

### Future Scaling Strategy

**When to scale:**
1. > 1000 active users/day
2. > 100 pages created
3. > 50GB images uploaded

**Solutions:**
1. Upgrade Firebase plan
2. Add Cloud Functions for complex operations
3. Implement caching layer (Redis)
4. Add CDN for static assets
5. Enable Firebase Storage for images

---

## 🔧 Development Workflow

### Local Development

```
1. Start Expo dev server
   $ cd frontend && expo start

2. Access via:
   - Web: http://localhost:3000
   - Mobile: Scan QR with Expo Go
   - Android Emulator: Press 'a'
   - iOS Simulator: Press 'i'

3. Hot reload enabled
   - Save file → Auto refresh
```

### Build Process

```
1. Development
   ├─ Edit files
   ├─ Metro bundler compiles
   └─ Hot reload updates

2. Testing
   ├─ Browser console (Web)
   ├─ React Native Debugger
   └─ Expo Go app (Mobile)

3. Production Build
   ├─ expo export (Web)
   └─ eas build (Mobile)
```

---

## 📝 Key Architectural Decisions

### Why Firebase?

✅ **Pros:**
- No backend code to maintain
- Auto-scaling
- Real-time capabilities
- Built-in authentication
- Free tier sufficient for MVP
- Fast development

❌ **Cons:**
- Vendor lock-in
- Limited free tier
- Complex queries difficult
- No SQL joins

### Why Expo?

✅ **Pros:**
- Fast development
- Cross-platform (iOS, Android, Web)
- OTA updates
- Rich ecosystem
- Good documentation
- File-based routing

❌ **Cons:**
- Larger bundle size vs bare React Native
- Some native modules not supported
- Requires Expo Go for testing

### Why No Backend Server?

✅ **Pros:**
- Simpler architecture
- No server maintenance
- Lower costs
- Faster development
- Auto-scaling

❌ **Cons:**
- Client-side logic exposure
- Limited complex operations
- Firestore query limitations
- Depends on Firebase availability

---

## 🎯 Architecture Best Practices

### 1. Separation of Concerns

```
Components (UI) ──> Services (Logic) ──> Firebase (Data)
```

### 2. Error Handling

```typescript
try {
  await service.operation()
  // Success handling
} catch (error) {
  console.error('[Service]', error)
  // User-friendly error message
  Alert.alert('Error', 'User-friendly message')
}
```

### 3. Type Safety

```typescript
// Define interfaces for all data models
interface UserProfile { ... }
interface PageContent { ... }
interface AppSettings { ... }
```

### 4. Security First

```typescript
// Never trust client
// Firestore rules enforce security
// Client code is just UI
```

### 5. Performance

```typescript
// Optimize queries
// Cache when possible
// Lazy load components
// Minimize re-renders
```

---

**Last Updated:** November 2025  
**Version:** 1.0  
**Architecture:** Client-Side Firebase
