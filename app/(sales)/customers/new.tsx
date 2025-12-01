import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ios16Components, ios16Palette, ios16Radii, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

type Package = {
  id: string;
  name: string;
  speed_mbps: number;
  price_monthly: number;
};

export default function NewCustomerScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    package_id: '',
    due_date: '1',
  });

  useEffect(() => {
    if (user) {
      loadPackages();
    }
  }, [user]);

  const loadPackages = async () => {
    if (!user) {
      console.warn('Cannot load packages: user not authenticated');
      return;
    }

    try {
      console.log('Loading packages for sales user:', user.id);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('speed_mbps', { ascending: true });

      if (error) {
        console.error('Error loading packages:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        throw error;
      }

      console.log('Packages loaded for sales:', {
        count: data?.length || 0,
        isArray: Array.isArray(data),
        data: data,
      });

      setPackages(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading packages:', error);
      Alert.alert('Error', `Gagal memuat data paket: ${error?.message || 'Unknown error'}`);
      setPackages([]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'User tidak ditemukan');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.package_id) {
      Alert.alert('Error', 'Nama, telepon, alamat, dan paket harus diisi');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('customers').insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        address: formData.address,
        package_id: formData.package_id,
        sales_id: user.id,
        due_date: parseInt(formData.due_date),
        status: 'active',
      });

      if (error) throw error;

      Alert.alert('Berhasil', 'Pelanggan berhasil didaftarkan', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error creating customer:', error);
      Alert.alert('Error', 'Gagal mendaftarkan pelanggan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, ios16Components.screenLight]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={ios16Typography.largeTitle}>Daftarkan Pelanggan Baru</Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={ios16Typography.subheadline}>Nama Pelanggan *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Nama lengkap"
                placeholderTextColor={ios16Palette.textQuaternaryLight}
              />
            </View>

            <View style={styles.field}>
              <Text style={ios16Typography.subheadline}>Telepon *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
                placeholder="081234567890"
                placeholderTextColor={ios16Palette.textQuaternaryLight}
              />
            </View>

            <View style={styles.field}>
              <Text style={ios16Typography.subheadline}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="email@example.com"
                placeholderTextColor={ios16Palette.textQuaternaryLight}
              />
            </View>

            <View style={styles.field}>
              <Text style={ios16Typography.subheadline}>Alamat *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                multiline
                numberOfLines={3}
                placeholder="Alamat lengkap"
                placeholderTextColor={ios16Palette.textQuaternaryLight}
              />
            </View>

            <View style={styles.field}>
              <Text style={ios16Typography.subheadline}>Paket *</Text>
              <View style={styles.selectContainer}>
                {packages.map((pkg) => (
                  <Pressable
                    key={pkg.id}
                    style={[
                      styles.selectOption,
                      formData.package_id === pkg.id && styles.selectOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, package_id: pkg.id })}
                  >
                    <Text
                      style={[
                        ios16Typography.body,
                        formData.package_id === pkg.id && styles.selectOptionTextActive,
                      ]}
                    >
                      {pkg.name} - {pkg.speed_mbps} Mbps
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={ios16Typography.subheadline}>Tanggal Jatuh Tempo *</Text>
              <TextInput
                style={styles.input}
                value={formData.due_date}
                onChangeText={(text) => setFormData({ ...formData, due_date: text })}
                keyboardType="numeric"
                placeholder="1-31"
                placeholderTextColor={ios16Palette.textQuaternaryLight}
              />
            </View>

            <View style={styles.actions}>
              <Button
                title="Batal"
                onPress={() => router.back()}
                variant="secondary"
                style={styles.actionButton}
              />
              <Button
                title="Daftarkan"
                onPress={handleSubmit}
                loading={isLoading}
                style={styles.actionButton}
              />
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: ios16Spacing.lg,
    gap: ios16Spacing.md,
  },
  header: {
    marginBottom: ios16Spacing.md,
  },
  formCard: {
    gap: ios16Spacing.lg,
  },
  form: {
    gap: ios16Spacing.md,
  },
  field: {
    gap: ios16Spacing.xs,
  },
  input: {
    backgroundColor: ios16Palette.backgroundMutedLight,
    borderRadius: ios16Radii.card,
    paddingHorizontal: ios16Spacing.lg,
    paddingVertical: ios16Spacing.md,
    color: ios16Palette.textPrimaryLight80,
    fontSize: 11,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectContainer: {
    gap: ios16Spacing.xs,
  },
  selectOption: {
    padding: ios16Spacing.md,
    borderRadius: ios16Radii.card,
    backgroundColor: ios16Palette.backgroundMutedLight,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectOptionActive: {
    borderColor: ios16Palette.accentBlue,
    backgroundColor: ios16Palette.accentBlue + '20',
  },
  selectOptionTextActive: {
    color: ios16Palette.accentBlue,
  },
  actions: {
    flexDirection: 'row',
    gap: ios16Spacing.md,
    marginTop: ios16Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});

