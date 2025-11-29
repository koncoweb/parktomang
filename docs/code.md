# Code Reference - Paroki Tomang App

## 📋 Table of Contents

1. [Firestore Security Rules](#firestore-security-rules)
2. [Firebase Configuration](#firebase-configuration)
3. [Authentication Code](#authentication-code)
4. [Service Layer Examples](#service-layer-examples)
5. [Component Patterns](#component-patterns)
6. [Common Code Snippets](#common-code-snippets)
7. [Styling Patterns](#styling-patterns)

---

## Firestore Security Rules

### Current Working Rules (Production)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // Helper Functions
    // ============================================
    
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
    
    // ============================================
    // Collection Rules
    // ============================================
    
    // Users Collection
    // - Anyone authenticated can read (for admin panel)
    // - Users can create their own profile on first login
    // - Admins can update any profile
    // - Only superadmin can delete users
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAdmin() || request.auth.uid == userId;
      allow delete: if isSuperAdmin();
    }
    
    // Settings Collection
    // - Public read (for app display)
    // - Authenticated users can create (first-time init)
    // - Authenticated users can update (admin panel)
    // - Only superadmin can delete
    match /settings/{settingId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isSuperAdmin();
    }
    
    // Pages Collection
    // - Public read (for app display)
    // - Only admins can create/update/delete
    match /pages/{pageId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

### Rule Explanation

**Security Levels:**
1. **Public Read** - Anyone can read (pages, settings)
2. **Authenticated** - Must be logged in
3. **Admin** - Must have admin or superadmin role
4. **SuperAdmin** - Must have superadmin role

**Key Points:**
- `exists()` check prevents errors if user doc doesn't exist
- `request.auth.uid` is the current user's ID
- `request.auth.uid == userId` ensures users can only edit themselves
- Rules are enforced server-side, client code can't bypass

---

## Firebase Configuration

### Firebase Initialization

**File:** `/app/frontend/config/firebase.ts`

```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgLPrzXq7uHNSv5KdBXRRWVQgRWDiKsrU",
  authDomain: "parokitomang-4f136.firebaseapp.com",
  projectId: "parokitomang-4f136",
  storageBucket: "parokitomang-4f136.firebasestorage.app",
  messagingSenderId: "717277110880",
  appId: "1:717277110880:web:01b6c2c687901071d79905"
};

// Initialize Firebase (singleton pattern)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with platform-specific persistence
let auth;
if (Platform.OS === 'web') {
  // Web: Use default persistence (localStorage)
  auth = getAuth(app);
} else {
  // Mobile: Use AsyncStorage for persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
const db = getFirestore(app);

// Export for use in services
export { app, auth, db };
```

**Key Points:**
- Singleton pattern prevents multiple initializations
- Platform-specific auth persistence (web vs mobile)
- AsyncStorage for mobile, localStorage for web
- Exports `auth` and `db` for use in services

---

## Authentication Code

### Auth Context

**File:** `/app/frontend/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  loginUser, 
  logoutUser, 
  onAuthChange,
  getCurrentUserProfile,
  seedSuperAdmin
} from '../services/auth.service';
import { initializeDefaultSettings } from '../services/settings.service';
import { UserProfile } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Firebase data
    const initialize = async () => {
      await seedSuperAdmin();
      await initializeDefaultSettings();
    };
    initialize();

    // Listen to auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const userProfile = await getCurrentUserProfile(firebaseUser.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: firebaseUser, profile: userProfile } = await loginUser(email, password);
      setUser(firebaseUser);
      setProfile(userProfile);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Login Service

**File:** `/app/frontend/services/auth.service.ts` (excerpt)

```typescript
import { 
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const SUPERADMIN_EMAIL = 'joni@email.com';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'superadmin' | 'admin';
  createdAt: any;
  updatedAt: any;
}

// Login with auto-profile creation
export const loginUser = async (email: string, password: string) => {
  try {
    console.log('[Auth] Attempting login for:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('[Auth] Login successful, UID:', user.uid);
    
    // Get user profile from Firestore
    let userDoc = await getDoc(doc(db, 'users', user.uid));
    console.log('[Auth] User profile exists:', userDoc.exists());
    
    // If profile doesn't exist, create it
    if (!userDoc.exists()) {
      console.log('[Auth] Creating new profile for:', email);
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: email === SUPERADMIN_EMAIL ? 'Super Admin' : user.displayName || 'Admin User',
        role: email === SUPERADMIN_EMAIL ? 'superadmin' : 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      try {
        await setDoc(doc(db, 'users', user.uid), newProfile);
        console.log('[Auth] Profile created successfully');
        userDoc = await getDoc(doc(db, 'users', user.uid));
      } catch (firestoreError: any) {
        console.error('[Auth] Error creating profile:', firestoreError);
        throw new Error(`Failed to create profile: ${firestoreError.message}`);
      }
    }
    
    const profileData = userDoc.data() as UserProfile;
    console.log('[Auth] Profile data:', profileData);
    
    return {
      user,
      profile: profileData
    };
  } catch (error: any) {
    console.error('[Auth] Login error:', error);
    throw new Error(error.message);
  }
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};

// Auth state listener
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
```

**Key Features:**
- Auto-creates profile if doesn't exist
- Detects superadmin by email
- Console logging for debugging
- Error handling with user-friendly messages

---

## Service Layer Examples

### Pages Service (CRUD)

**File:** `/app/frontend/services/pages.service.ts`

```typescript
import { 
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export type PageType = 'static' | 'webview' | 'youtube_video' | 'youtube_channel' | 'data_table';

export interface PageContent {
  id: string;
  title: string;
  slug: string;
  icon: string;
  type: PageType;
  order: number;
  active: boolean;
  richTextContent?: string;
  webviewUrl?: string;
  youtubeVideos?: Array<{...}>;
  createdAt: any;
  updatedAt: any;
  createdBy: string;
}

// Get all pages (ordered)
export const getAllPages = async (): Promise<PageContent[]> => {
  try {
    const pagesQuery = query(
      collection(db, 'pages'),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(pagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PageContent));
  } catch (error) {
    console.error('Error getting pages:', error);
    return [];
  }
};

// Create new page
export const createPage = async (pageData: Omit<PageContent, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const pageRef = doc(collection(db, 'pages'));
    const newPage = {
      ...pageData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(pageRef, newPage);
    return pageRef.id;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
};

// Update page
export const updatePage = async (pageId: string, pageData: Partial<PageContent>) => {
  try {
    const pageRef = doc(db, 'pages', pageId);
    await updateDoc(pageRef, {
      ...pageData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating page:', error);
    throw error;
  }
};

// Delete page
export const deletePage = async (pageId: string) => {
  try {
    await deleteDoc(doc(db, 'pages', pageId));
  } catch (error) {
    console.error('Error deleting page:', error);
    throw error;
  }
};
```

**Usage Pattern:**
```typescript
// In component
import { getAllPages, createPage } from '../services/pages.service';

const MyComponent = () => {
  const [pages, setPages] = useState([]);
  
  useEffect(() => {
    loadPages();
  }, []);
  
  const loadPages = async () => {
    const data = await getAllPages();
    setPages(data);
  };
  
  const handleCreate = async () => {
    await createPage({
      title: 'New Page',
      slug: 'new-page',
      // ...
    });
    loadPages(); // Refresh
  };
};
```

---

## Component Patterns

### Protected Route Pattern

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function ProtectedPage() {
  const { user, profile } = useAuth();
  
  // Redirect if not authenticated
  if (!user) {
    return <Redirect href="/adm" />;
  }
  
  // Show error if no profile
  if (!profile) {
    return <Text>Profile not found</Text>;
  }
  
  return (
    <View>
      <Text>Welcome {profile.displayName}</Text>
    </View>
  );
}
```

### Modal Form Pattern

```typescript
const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState({ ... });

return (
  <>
    <TouchableOpacity onPress={() => setShowModal(true)}>
      <Text>Open Form</Text>
    </TouchableOpacity>
    
    <Modal visible={showModal} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <ScrollView>
            {/* Form fields */}
            <TextInput
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
            />
            
            <TouchableOpacity onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  </>
);
```

### List with Empty State

```typescript
{items.length === 0 ? (
  <View style={styles.emptyState}>
    <Ionicons name="document-outline" size={64} color="#CCC" />
    <Text style={styles.emptyText}>No items yet</Text>
    <Text style={styles.emptySubtext}>Click add button to create</Text>
  </View>
) : (
  items.map(item => (
    <View key={item.id} style={styles.itemCard}>
      <Text>{item.title}</Text>
    </View>
  ))
)}
```

---

## Common Code Snippets

### Image Picker (Base64)

```typescript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  // Request permission (mobile only)
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied');
      return;
    }
  }
  
  const result = await ImagePicker.launchImagePickerAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: true,
  });
  
  if (!result.canceled && result.assets[0].base64) {
    const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
    // Use base64Image
  }
};
```

### Rich Text Editor

```typescript
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const richText = useRef<RichEditor>(null);

<RichToolbar
  editor={richText}
  actions={[
    actions.setBold,
    actions.setItalic,
    actions.insertBulletsList,
    actions.insertLink,
  ]}
/>
<RichEditor
  ref={richText}
  initialContentHTML={content}
  onChange={(html) => setContent(html)}
  placeholder="Start typing..."
/>
```

### Dynamic List Input

```typescript
const [videos, setVideos] = useState([]);

const handleAddVideo = () => {
  const newVideo = {
    id: Date.now().toString(),
    title: '',
    videoId: '',
  };
  setVideos([...videos, newVideo]);
};

const handleRemoveVideo = (id: string) => {
  setVideos(videos.filter(v => v.id !== id));
};

const handleVideoChange = (id: string, field: string, value: string) => {
  setVideos(videos.map(v => 
    v.id === id ? { ...v, [field]: value } : v
  ));
};

// Render
{videos.map(video => (
  <View key={video.id}>
    <TextInput
      value={video.title}
      onChangeText={(text) => handleVideoChange(video.id, 'title', text)}
    />
    <TouchableOpacity onPress={() => handleRemoveVideo(video.id)}>
      <Ionicons name="trash" />
    </TouchableOpacity>
  </View>
))}
```

---

## Styling Patterns

### Color Scheme

```typescript
const COLORS = {
  primary: '#8B4513',      // Brown
  secondary: '#D2691E',    // Chocolate
  background: '#FFF8F0',   // Cornsilk
  text: '#5D4037',         // Dark brown
  textLight: '#666',
  border: '#E0D5C7',
  success: '#4CAF50',
  error: '#D32F2F',
  warning: '#FF9800',
};
```

### Responsive Width

```typescript
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

// Conditional styling
style={[
  styles.container,
  isMobile && styles.containerMobile,
  isDesktop && styles.containerDesktop,
]}
```

### Common Styles

```typescript
const styles = StyleSheet.create({
  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  // Button
  button: {
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Input
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  
  // Section title
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 16,
  },
});
```

---

## TypeScript Interfaces

### Core Data Models

```typescript
// User Profile
interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'superadmin' | 'admin';
  createdAt: any;
  updatedAt: any;
}

// App Settings
interface AppSettings {
  appName: string;
  parokiName: string;
  headerText: string;
  footerText: string;
  logoBase64?: string;
  iconBase64?: string;
  faviconBase64?: string;
  primaryColor: string;
  secondaryColor: string;
  updatedAt: any;
}

// Page Content
interface PageContent {
  id: string;
  title: string;
  slug: string;
  icon: string;
  type: 'static' | 'webview' | 'youtube_video' | 'youtube_channel' | 'data_table';
  order: number;
  active: boolean;
  richTextContent?: string;
  webviewUrl?: string;
  youtubeVideos?: Array<{
    id: string;
    title: string;
    videoId: string;
    thumbnailUrl?: string;
  }>;
  youtubeChannelId?: string;
  tableTitle?: string;
  tableColumns?: Array<any>;
  tableData?: Array<any>;
  createdAt: any;
  updatedAt: any;
  createdBy: string;
}
```

---

**Code Reference Complete!**  
**Last Updated:** November 2025  
**Version:** 1.0
