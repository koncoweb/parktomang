import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { ios16Palette } from '@/constants/ios16TemplateStyles';

export default function Index() {
  const { isAuthenticated, isLoading, profile, user } = useAuth();
  const router = useRouter();
  const lastRedirectRef = useRef<string | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending redirect
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }

    if (isLoading) {
      console.log('Index: Still loading...');
      return;
    }

    const role = profile?.role;
    
    // Jika tidak authenticated atau tidak ada user, redirect ke login
    if (!isAuthenticated || !user) {
      console.log('Index: Not authenticated, redirecting to login');
      const target = '/login';
      if (lastRedirectRef.current !== target) {
        lastRedirectRef.current = target;
        router.replace(target);
      }
      return;
    }

    // Jika ada user tapi profile belum di-load, tunggu sebentar
    // Profile akan di-load oleh onAuthStateChange setelah session di-set
    if (!profile || !role) {
      console.log('Index: User authenticated but profile not loaded yet, waiting...');
      // Tunggu maksimal 2 detik untuk profile di-load
      redirectTimeoutRef.current = setTimeout(() => {
        if (!profile || !profile.role) {
          console.log('Index: Profile still not loaded after timeout, redirecting to login');
          const target = '/login';
          if (lastRedirectRef.current !== target) {
            lastRedirectRef.current = target;
            router.replace(target);
          }
        }
      }, 2000);
      return;
    }

    // Determine redirect target based on role
    let target: string;
    if (role === 'owner') {
      target = '/(owner)/dashboard';
    } else if (role === 'admin') {
      target = '/(admin)/dashboard';
    } else if (role === 'sales') {
      target = '/(sales)/dashboard';
    } else {
      console.log('Index: Invalid role, redirecting to login');
      target = '/login';
    }

    // Only redirect if target changed
    if (lastRedirectRef.current !== target) {
      console.log('Index: Redirecting to', target);
      lastRedirectRef.current = target;
      router.replace(target);
    }
  }, [isAuthenticated, isLoading, profile, user, router]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: ios16Palette.backgroundDark }}>
        <ActivityIndicator size="large" color={ios16Palette.accentBlue} />
      </View>
    );
  }

  // Return loading while redirecting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: ios16Palette.backgroundDark }}>
      <ActivityIndicator size="large" color={ios16Palette.accentBlue} />
    </View>
  );
}

