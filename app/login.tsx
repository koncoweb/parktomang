import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    ios16Palette,
    ios16Radii,
    ios16Spacing,
    ios16Typography,
} from '@/constants/ios16TemplateStyles';
import { useAuth } from '@/hooks/use-auth';
import { PageLayout } from '@/components/page-layout';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: signInError } = await signIn({ email, password });

    if (signInError) {
      setIsLoading(false);
      setError(signInError.message || 'Gagal masuk. Periksa email dan password Anda.');
      return;
    }

    // Tunggu sebentar untuk memastikan session dan profile sudah di-load
    // Redirect akan dihandle oleh app/index.tsx berdasarkan role setelah profile ter-load
    // Jangan langsung redirect, biarkan onAuthStateChange dan app/index.tsx yang handle
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/');
    }, 500);
  };

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <PageLayout showBanner={true}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Tombol MASUK di tengah */}
            {!showForm && (
              <View style={styles.centerButtonContainer}>
                <Image
                  source={require('@/assets/images/logo-removebg-preview.png')}
                  style={styles.smallLogo}
                  resizeMode="contain"
                />
                <Pressable 
                  style={styles.blueButton}
                  onPress={() => setShowForm(true)}
                >
                  <Text style={styles.blueButtonText}>MASUK</Text>
                </Pressable>
              </View>
            )}
            
            {/* Form Login Modal/Card */}
            {showForm && (
              <View style={styles.modalOverlay}>
                <View style={styles.formCard}>
                  <Pressable 
                    style={styles.closeButton}
                    onPress={() => setShowForm(false)}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </Pressable>
                  
                  <View style={styles.logoContainer}>
                    <Image
                      source={require('@/assets/images/logo-removebg-preview.png')}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                  
                  <Text style={styles.formTitle}>Masuk ke Akun</Text>
                
                <View style={styles.field}>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    inputMode="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholder="Email"
                    placeholderTextColor="rgba(15, 81, 50, 0.4)"
                  />
                </View>

                <View style={styles.field}>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Password"
                    placeholderTextColor="rgba(15, 81, 50, 0.4)"
                  />
                </View>

                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <Pressable 
                  style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Masuk</Text>
                  )}
                </Pressable>

                <Pressable style={styles.secondaryAction}>
                  <Text style={styles.secondaryActionText}>
                    Lupa password?
                  </Text>
                </Pressable>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Belum punya akun?</Text>
                  <Link href="/register" style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Buat akun</Text>
                  </Link>
                </View>
                </View>
              </View>
            )}
          </KeyboardAvoidingView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#FFFFFF',
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ios16Spacing.lg,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F5132',
    marginBottom: ios16Spacing.xxs,
  },
  dateText: {
    fontSize: 8.4,
    color: 'rgba(15, 81, 50, 0.7)',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  heroCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroCardImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  heroCardOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: ios16Spacing.xl,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ios16Spacing.lg,
  },
  heroContent: {
    flex: 1,
    marginRight: ios16Spacing.md,
  },
  heroTitle: {
    fontSize: 16.8,
    fontWeight: '700',
    color: '#0F5132',
    marginBottom: ios16Spacing.xs,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 9,
    color: '#0F5132',
    lineHeight: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusCard: {
    alignSelf: 'flex-start',
    backgroundColor: '#30D158',
    borderRadius: ios16Radii.card,
    paddingHorizontal: ios16Spacing.lg,
    paddingVertical: ios16Spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ios16Spacing.xs,
  },
  statusValue: {
    fontSize: 10.8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusLabel: {
    fontSize: 7.2,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  infoCards: {
    flexDirection: 'row',
    gap: ios16Spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: ios16Radii.card,
    padding: ios16Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  infoCardValue: {
    fontSize: 14.4,
    fontWeight: '700',
    color: '#0F5132',
    marginBottom: ios16Spacing.xxs,
  },
  infoCardLabel: {
    fontSize: 7.2,
    color: 'rgba(15, 81, 50, 0.7)',
  },
  centerButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    gap: ios16Spacing.xl,
  },
  smallLogo: {
    width: Dimensions.get('window').height * 0.3,
    height: Dimensions.get('window').height * 0.3,
  },
  blueButton: {
    backgroundColor: '#0051D5', // Biru tua
    borderRadius: ios16Radii.chip,
    paddingHorizontal: ios16Spacing.xxl * 2,
    paddingVertical: ios16Spacing.lg,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 81, 213, 0.2)', // Border subtle
    ...Platform.select({
      ios: {
        shadowColor: '#0051D5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0, 81, 213, 0.3)',
      },
    }),
  },
  blueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    padding: ios16Spacing.xxl,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ios16Radii.widget,
    padding: ios16Spacing.xl,
    gap: ios16Spacing.lg,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: ios16Spacing.md,
    right: ios16Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#0F5132',
    lineHeight: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: ios16Spacing.lg,
    marginTop: ios16Spacing.md,
  },
  logo: {
    width: 120,
    height: 120,
  },
  formTitle: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#0F5132',
    marginBottom: ios16Spacing.sm,
    textAlign: 'center',
  },
  field: {
    gap: ios16Spacing.xs,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: ios16Radii.card,
    paddingHorizontal: ios16Spacing.lg,
    paddingVertical: ios16Spacing.md,
    color: '#0F5132',
    fontSize: 11.5,
    borderWidth: 1,
    borderColor: 'rgba(15, 81, 50, 0.1)',
  },
  primaryButton: {
    backgroundColor: '#0051D5', // Biru tua
    borderRadius: ios16Radii.chip,
    paddingVertical: ios16Spacing.md,
    alignItems: 'center',
    marginTop: ios16Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 81, 213, 0.2)', // Border subtle
    ...Platform.select({
      ios: {
        shadowColor: '#0051D5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0, 81, 213, 0.3)',
      },
    }),
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  secondaryAction: {
    alignSelf: 'center',
    paddingVertical: ios16Spacing.xs,
    paddingHorizontal: ios16Spacing.md,
  },
  secondaryActionText: {
    fontSize: 10,
    color: '#0F5132',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ios16Spacing.xs,
    marginTop: ios16Spacing.lg,
    paddingTop: ios16Spacing.md,
  },
  footerText: {
    fontSize: 10,
    color: 'rgba(15, 81, 50, 0.7)',
  },
  footerLink: {
    // Link styling
  },
  footerLinkText: {
    fontSize: 10,
    color: '#0F5132',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: ios16Radii.card,
    padding: ios16Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  errorText: {
    fontSize: 9.2,
    color: '#FF3B30',
    textAlign: 'center',
    fontWeight: '500',
  },
});


