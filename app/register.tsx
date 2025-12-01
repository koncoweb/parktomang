import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    ios16Components,
    ios16Palette,
    ios16Radii,
    ios16Spacing,
    ios16Typography,
} from '@/constants/ios16TemplateStyles';
import { useAuth } from '@/hooks/use-auth';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: signUpError } = await signUp({ 
      email, 
      password, 
      fullName: name,
      role: 'sales' // Default role untuk registrasi baru
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message || 'Gagal mendaftar. Silakan coba lagi.');
    } else {
      Alert.alert('Berhasil', 'Akun berhasil dibuat. Silakan masuk.', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Hero Section - Fullscreen */}
          <ImageBackground
            source={require('@/assets/images/asro network.webp')}
            style={styles.heroCard}
            imageStyle={styles.heroCardImage}
          >
            <View style={styles.heroCardOverlay}>
              <View style={styles.heroHeader}>
                <View style={styles.heroContent}>
                  <Text style={styles.heroTitle}>Selamat Datang</Text>
                  <Text style={styles.heroSubtitle}>
                    Sistem Manajemen ASRO network
                  </Text>
                </View>
                <View style={styles.avatarPlaceholder} />
              </View>
            </View>
          </ImageBackground>

          {/* Form Register Modal/Card */}
          <View style={styles.modalOverlay}>
            <View style={styles.formCard}>
              <Pressable 
                style={styles.closeButton}
                onPress={() => router.replace('/login')}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
              
              <Text style={styles.formTitle}>Buat Akun</Text>
                
                <View style={styles.field}>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nama lengkap"
                    placeholderTextColor="rgba(15, 81, 50, 0.4)"
                  />
                </View>

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

                <View style={styles.field}>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="Konfirmasi Password"
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
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Buat Akun</Text>
                  )}
                </Pressable>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Sudah punya akun?</Text>
                  <Link href="/login" style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Masuk</Text>
                  </Link>
                </View>
              </View>
            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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
  heroCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
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
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E9ECEF',
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
  },
  blueButton: {
    backgroundColor: '#0A84FF',
    borderRadius: ios16Radii.chip,
    paddingHorizontal: ios16Spacing.xxl * 2,
    paddingVertical: ios16Spacing.lg,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  formTitle: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#0F5132',
    marginBottom: ios16Spacing.sm,
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
    backgroundColor: '#0F5132',
    borderRadius: ios16Radii.chip,
    paddingVertical: ios16Spacing.md,
    alignItems: 'center',
    marginTop: ios16Spacing.sm,
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
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


