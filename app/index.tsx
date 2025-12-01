import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { ios16Palette } from '@/constants/ios16TemplateStyles';

export default function Index() {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const router = useRouter();
  const lastRedirectRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const role = profile?.role;
    
    if (!isAuthenticated || !profile || !role) {
      const target = '/login';
      if (lastRedirectRef.current !== target) {
        lastRedirectRef.current = target;
        router.replace(target);
      }
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
      target = '/login';
    }

    // Only redirect if target changed
    if (lastRedirectRef.current !== target) {
      lastRedirectRef.current = target;
      router.replace(target);
    }
  }, [isAuthenticated, isLoading, profile?.role]);

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

