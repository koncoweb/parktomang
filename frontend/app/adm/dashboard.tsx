import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/adm');
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/adm');
          },
        },
      ]
    );
  };

  const handleBackHome = () => {
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBackHome} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Ionicons name="person-circle" size={64} color="#8B4513" />
          <Text style={styles.welcomeText}>Selamat Datang</Text>
          <Text style={styles.emailText}>{user.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Super Admin</Text>
          </View>
        </View>

        {/* Coming Soon Section */}
        <View style={styles.comingSoonSection}>
          <Ionicons name="construct" size={48} color="#D2691E" />
          <Text style={styles.comingSoonTitle}>Fitur Dalam Pengembangan</Text>
          <Text style={styles.comingSoonText}>
            Dashboard admin sedang dalam tahap pengembangan.
          </Text>
          <Text style={styles.comingSoonSubtext}>
            Fitur yang akan datang:
          </Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#8B4513" />
              <Text style={styles.featureText}>Manajemen Slider Banner</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#8B4513" />
              <Text style={styles.featureText}>Pengaturan Menu & Icon</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#8B4513" />
              <Text style={styles.featureText}>Pembuatan Halaman & Sub-halaman</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#8B4513" />
              <Text style={styles.featureText}>Content Management (Text, Video, WebView)</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#8B4513" />
              <Text style={styles.featureText}>Manajemen User Admin</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    backgroundColor: '#8B4513',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B4513',
    marginTop: 16,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  comingSoonSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8B4513',
    marginTop: 16,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  comingSoonSubtext: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginTop: 24,
    marginBottom: 16,
  },
  featureList: {
    width: '100%',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 15,
    color: '#5D4037',
    flex: 1,
  },
});
