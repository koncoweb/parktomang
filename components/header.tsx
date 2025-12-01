import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { ios16Palette, ios16Radii, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  const { signOut, profile } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      
      // For web production (static export), use window.location for proper redirect
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Use window.location for hard redirect to ensure session is cleared
        window.location.href = '/login';
      } else {
        // For native platforms, use router
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, try to redirect
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        router.replace('/login');
      }
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerText}>
          <Text style={ios16Typography.largeTitle}>{title}</Text>
          {subtitle && (
            <Text style={[ios16Typography.body, styles.subtitle]}>{subtitle}</Text>
          )}
        </View>
        <Pressable style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutText}>Keluar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: ios16Spacing.lg,
    paddingTop: ios16Spacing.md,
    paddingBottom: ios16Spacing.md,
    backgroundColor: ios16Palette.backgroundLight,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: ios16Spacing.md,
  },
  headerText: {
    flex: 1,
    gap: ios16Spacing.xs,
  },
  subtitle: {
    color: ios16Palette.textPrimaryLight80,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: ios16Palette.accentBlue + '15',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ios16Palette.accentBlue + '40',
    height: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    color: ios16Palette.accentBlue,
  },
});

