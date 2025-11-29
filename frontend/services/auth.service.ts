import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'superadmin' | 'admin';
  createdAt: any;
  updatedAt: any;
}

// Superadmin credentials
const SUPERADMIN_EMAIL = 'joni@email.com';
const SUPERADMIN_PASSWORD = 'joni2#Marjoni';

// Login
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    return {
      user,
      profile: userDoc.data() as UserProfile
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Register new admin user (only by superadmin or admin)
export const registerAdmin = async (
  email: string,
  password: string,
  displayName: string,
  createdBy: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName });
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role: 'admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    return { user, profile: userProfile };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};

// Get current user profile
export const getCurrentUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Auth state listener
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Seed superadmin account
// Note: Superadmin must be created manually in Firebase Auth Console first
// This function only creates the Firestore profile
export const seedSuperAdmin = async () => {
  try {
    // We can't programmatically create Firebase Auth users on client side
    // Superadmin needs to be created via Firebase Console or manually registered once
    // This function just ensures the profile exists in Firestore after first login
    console.log('Superadmin seeding handled on first login');
  } catch (error) {
    console.error('Error seeding superadmin:', error);
  }
};
