import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ios16Components, ios16Palette, ios16Radii, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { formatCurrency } from '@/lib/utils/date-utils';

type Package = {
  id: string;
  name: string;
  speed_mbps: number;
  price_monthly: number;
  description: string | null;
  is_active: boolean;
};

export default function PackagesScreen() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    speed_mbps: '',
    price_monthly: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('speed_mbps', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error loading packages:', error);
      Alert.alert('Error', 'Gagal memuat data paket');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.speed_mbps || !formData.price_monthly) {
      Alert.alert('Error', 'Nama, kecepatan, dan harga harus diisi');
      return;
    }

    try {
      const packageData = {
        name: formData.name,
        speed_mbps: parseInt(formData.speed_mbps),
        price_monthly: parseFloat(formData.price_monthly),
        description: formData.description || null,
        is_active: formData.is_active,
      };

      if (editingPackage) {
        const { error } = await supabase
          .from('packages')
          .update(packageData)
          .eq('id', editingPackage.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('packages').insert(packageData);
        if (error) throw error;
      }

      setIsModalVisible(false);
      resetForm();
      await loadPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      Alert.alert('Error', 'Gagal menyimpan paket');
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      speed_mbps: pkg.speed_mbps.toString(),
      price_monthly: pkg.price_monthly.toString(),
      description: pkg.description || '',
      is_active: pkg.is_active,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string, name: string) => {
    Alert.alert(
      'Hapus Paket',
      `Apakah Anda yakin ingin menghapus ${name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('packages').delete().eq('id', id);
              if (error) throw error;
              await loadPackages();
            } catch (error) {
              console.error('Error deleting package:', error);
              Alert.alert('Error', 'Gagal menghapus paket');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      speed_mbps: '',
      price_monthly: '',
      description: '',
      is_active: true,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, ios16Components.screenLight]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ios16Palette.accentBlue} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, ios16Components.screenLight]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={ios16Typography.largeTitle}>Manajemen Paket</Text>
          <Button
            title="Tambah Paket"
            onPress={() => {
              resetForm();
              setIsModalVisible(true);
            }}
            style={styles.addButton}
          />
        </View>

        {packages.map((pkg) => (
          <Card key={pkg.id} style={styles.packageCard}>
            <View style={styles.packageInfo}>
              <Text style={[ios16Typography.headline, styles.packageName]}>{pkg.name}</Text>
              <Text style={[ios16Typography.body, styles.packageSpeed]}>{pkg.speed_mbps} Mbps</Text>
              <Text style={[ios16Typography.title2, styles.packagePrice]}>
                {formatCurrency(pkg.price_monthly)}/bulan
              </Text>
              {pkg.description && (
                <Text style={[ios16Typography.caption, styles.packageDescription]}>{pkg.description}</Text>
              )}
              <Text style={[ios16Typography.caption, styles.status]}>
                Status: {pkg.is_active ? 'Aktif' : 'Tidak Aktif'}
              </Text>
            </View>
            <View style={styles.actions}>
              <Button
                title="Edit"
                onPress={() => handleEdit(pkg)}
                variant="secondary"
                style={styles.actionButton}
              />
              <Button
                title="Hapus"
                onPress={() => handleDelete(pkg.id, pkg.name)}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>
          </Card>
        ))}

        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <Card style={styles.modalContent}>
              <Text style={[ios16Typography.largeTitle, styles.modalTitle]}>
                {editingPackage ? 'Edit Paket' : 'Tambah Paket'}
              </Text>

              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={ios16Typography.subheadline}>Nama Paket</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Contoh: Paket 50 Mbps"
                    placeholderTextColor={ios16Palette.textQuaternaryLight}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={ios16Typography.subheadline}>Kecepatan (Mbps)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.speed_mbps}
                    onChangeText={(text) => setFormData({ ...formData, speed_mbps: text })}
                    keyboardType="numeric"
                    placeholder="50"
                    placeholderTextColor={ios16Palette.textQuaternaryLight}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={ios16Typography.subheadline}>Harga Bulanan (Rp)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.price_monthly}
                    onChangeText={(text) => setFormData({ ...formData, price_monthly: text })}
                    keyboardType="numeric"
                    placeholder="300000"
                    placeholderTextColor={ios16Palette.textQuaternaryLight}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={ios16Typography.subheadline}>Deskripsi</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    multiline
                    numberOfLines={3}
                    placeholder="Deskripsi paket"
                    placeholderTextColor={ios16Palette.textQuaternaryLight}
                  />
                </View>

                <View style={styles.actions}>
                  <Button
                    title="Batal"
                    onPress={() => {
                      setIsModalVisible(false);
                      resetForm();
                    }}
                    variant="secondary"
                    style={styles.actionButton}
                  />
                  <Button title="Simpan" onPress={handleSave} style={styles.actionButton} />
                </View>
              </View>
            </Card>
          </View>
        </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: ios16Spacing.md,
    gap: ios16Spacing.md,
  },
  addButton: {
    width: 'auto',
    alignSelf: 'flex-start',
  },
  packageCard: {
    gap: ios16Spacing.md,
  },
  packageInfo: {
    gap: ios16Spacing.xs,
  },
  packageName: {
    color: ios16Palette.textPrimaryLight80,
  },
  packageSpeed: {
    color: ios16Palette.textPrimaryLight80,
  },
  packagePrice: {
    color: ios16Palette.accentBlue,
  },
  packageDescription: {
    color: ios16Palette.textQuaternaryLight,
  },
  status: {
    color: ios16Palette.textPrimaryLight80,
  },
  actions: {
    flexDirection: 'row',
    gap: ios16Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ios16Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: ios16Spacing.lg,
    color: ios16Palette.textPrimaryLight80,
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
});

