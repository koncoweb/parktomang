import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PageDetail() {
  const { slug } = useLocalSearchParams();

  const getPageTitle = (slug: string) => {
    const titles: { [key: string]: string } = {
      misa: 'Misa Gereja & Intensi Misa',
      paroki: 'Paroki Tomang - Gereja MBK',
      pelayanan: 'Pelayanan Gereja MBK',
      renungan: 'Renungan Harian Katolik',
      kegiatan: 'Kegiatan MBK Akan Datang',
      kontak: 'Kontak & Informasi',
    };
    return titles[slug as string] || 'Halaman';
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <View style={styles.placeholderContainer}>
          <Ionicons name="document-text" size={80} color="#D2691E" />
          <Text style={styles.title}>{getPageTitle(slug as string)}</Text>
          <Text style={styles.subtitle}>Segera Hadir</Text>
          <Text style={styles.description}>
            Halaman ini sedang dalam tahap pengembangan.
            Konten akan ditambahkan melalui admin panel.
          </Text>
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
  content: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D2691E',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
