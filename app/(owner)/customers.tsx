import { useEffect, useState, useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, TextInput, Alert, Modal, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { PageLayout } from '@/components/page-layout';
import { ios16Palette, ios16Radii, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { formatDate } from '@/lib/utils/date-utils';
import { useAuth } from '@/hooks/use-auth';

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string;
  package_id: string;
  sales_id: string;
  due_date: number;
  status: string;
  packages?: { name: string; speed_mbps: number; price_monthly: number };
  user_profiles?: { full_name: string | null };
};

type Package = {
  id: string;
  name: string;
  speed_mbps: number;
  price_monthly: number;
};

type User = {
  id: string;
  full_name: string | null;
  user_id: string;
};

export default function CustomersScreen() {
  const { user, ensureValidSession } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [sales, setSales] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const packagesLoadedRef = useRef(false);
  const isLoadingPackagesRef = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    package_id: '',
    sales_id: '',
    due_date: '1',
    status: 'active',
  });

  const loadPackagesOnly = useCallback(async () => {
    if (!user) {
      console.warn('Cannot load packages: user not authenticated');
      return;
    }

    // Prevent multiple simultaneous calls using ref
    if (isLoadingPackagesRef.current) {
      return;
    }

    isLoadingPackagesRef.current = true;
    setIsLoadingPackages(true);
    try {
      console.log('Loading packages for user:', user.id);
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('speed_mbps', { ascending: true });

      if (packagesError) {
        console.error('Error loading packages:', packagesError);
        console.error('Error code:', packagesError.code);
        console.error('Error message:', packagesError.message);
        console.error('Error details:', packagesError.details);
        console.error('Error hint:', packagesError.hint);
        // Don't set empty array, keep existing packages if error
        return;
      }

      const validPackages = Array.isArray(packagesData) ? packagesData : [];
      console.log('Packages loaded:', validPackages.length);
      setPackages(validPackages);
      packagesLoadedRef.current = true;
    } catch (error: any) {
      console.error('Error loading packages:', error);
      // Don't set empty array, keep existing packages if error
    } finally {
      isLoadingPackagesRef.current = false;
      setIsLoadingPackages(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (isModalVisible && user) {
      // Only load if not already loading and not already loaded in this session
      if (!isLoadingPackagesRef.current && !packagesLoadedRef.current) {
        loadPackagesOnly();
      }
    } else if (!isModalVisible) {
      // Reset ref when modal closes to allow reload next time
      packagesLoadedRef.current = false;
    }
  }, [isModalVisible, user?.id, loadPackagesOnly]);

  const loadData = async () => {
    if (!user) {
      console.warn('Cannot load data: user not authenticated');
      return;
    }

    try {
      // Load customers with packages join
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select(`
          *,
          packages:package_id(name, speed_mbps, price_monthly)
        `)
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;

      // Get unique sales IDs from customers
      const salesIds = customersData 
        ? [...new Set(customersData.map(c => c.sales_id).filter(Boolean))]
        : [];

      // Load user profiles for sales
      let salesProfilesMap: Record<string, { full_name: string | null }> = {};
      if (salesIds.length > 0) {
        const { data: salesProfiles, error: salesProfilesError } = await supabase
          .from('user_profiles')
          .select('user_id, full_name')
          .in('user_id', salesIds);

        if (salesProfilesError) {
          console.error('Error loading sales profiles:', salesProfilesError);
        } else if (salesProfiles) {
          salesProfilesMap = salesProfiles.reduce((acc, profile) => {
            acc[profile.user_id] = { full_name: profile.full_name };
            return acc;
          }, {} as Record<string, { full_name: string | null }>);
        }
      }

      // Map sales profiles to customers
      const customersWithSales = customersData 
        ? customersData.map(customer => ({
            ...customer,
            user_profiles: salesProfilesMap[customer.sales_id] || { full_name: null }
          }))
        : [];

      // Load packages - simplified query
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('speed_mbps', { ascending: true });

      if (packagesError) {
        console.error('Error loading packages:', packagesError);
        console.error('Error code:', packagesError.code);
        console.error('Error message:', packagesError.message);
        console.error('Error details:', packagesError.details);
        console.error('Error hint:', packagesError.hint);
        // Don't throw error, keep existing packages if any
        // Use functional update to avoid dependency on packages state
        setPackages((prevPackages) => {
          if (prevPackages.length === 0) {
            return [];
          }
          return prevPackages;
        });
      } else {
        const validPackages = Array.isArray(packagesData) ? packagesData : [];
        console.log('Packages loaded in loadData:', validPackages.length);
        setPackages(validPackages);
        packagesLoadedRef.current = true;
      }

      // Load sales users for dropdown
      const { data: salesData, error: salesError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'sales');

      if (salesError) throw salesError;

      setCustomers(customersWithSales);
      setSales(salesData || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      const errorMessage = error?.message || 'Gagal memuat data';
      console.error('Error details:', {
        code: error?.code,
        message: errorMessage,
        details: error?.details,
        hint: error?.hint,
      });
      
      // Set empty arrays to prevent UI crashes
      setCustomers([]);
      // Don't clear packages on error if they already exist
      // Use functional update to avoid dependency on packages state
      setPackages((prevPackages) => {
        if (prevPackages.length === 0) {
          return [];
        }
        return prevPackages;
      });
      setSales([]);
      
      Alert.alert('Error', `Gagal memuat data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.package_id || !formData.sales_id) {
      Alert.alert('Error', 'Semua field wajib harus diisi');
      return;
    }

    try {
      // Pastikan session valid sebelum operasi database
      const { session: validSession, error: sessionError } = await ensureValidSession();
      if (sessionError || !validSession) {
        Alert.alert('Error', 'Session tidak valid. Silakan login ulang.');
        return;
      }

      const customerData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        address: formData.address,
        package_id: formData.package_id,
        sales_id: formData.sales_id,
        due_date: parseInt(formData.due_date),
        status: formData.status,
      };

      // Wrapper untuk operasi database dengan retry jika expired session
      const performDatabaseOperation = async (operation: () => Promise<any>, retryCount = 0): Promise<any> => {
        try {
          return await operation();
        } catch (error: any) {
          // Cek apakah error karena expired session
          const isExpiredSession = 
            error?.message?.includes('expired') ||
            error?.message?.includes('Invalid JWT') ||
            error?.message?.includes('JWT') ||
            error?.code === 'PGRST301' ||
            error?.status === 401;

          if (isExpiredSession && retryCount < 1) {
            // Coba refresh session dan retry sekali
            console.log('Session expired during operation, refreshing and retrying...');
            const { session: refreshedSession, error: refreshError } = await ensureValidSession();
            
            if (refreshError || !refreshedSession) {
              throw new Error('Session expired. Silakan login ulang.');
            }

            // Retry operasi setelah refresh
            return await performDatabaseOperation(operation, retryCount + 1);
          }
          
          throw error;
        }
      };

      if (editingCustomer) {
        const { error } = await performDatabaseOperation(async () => {
          return await supabase
            .from('customers')
            .update(customerData)
            .eq('id', editingCustomer.id);
        });
        if (error) throw error;
      } else {
        const { error } = await performDatabaseOperation(async () => {
          return await supabase.from('customers').insert(customerData);
        });
        if (error) throw error;
      }

      setIsModalVisible(false);
      resetForm();
      await loadData();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      // Cek apakah error terkait dengan expired session
      if (error?.message?.includes('expired') || error?.message?.includes('Invalid JWT') || error?.status === 401) {
        Alert.alert('Error', 'Session expired. Silakan login ulang.');
      } else {
        Alert.alert('Error', 'Gagal menyimpan pelanggan');
      }
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address,
      package_id: customer.package_id,
      sales_id: customer.sales_id,
      due_date: customer.due_date.toString(),
      status: customer.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string, name: string) => {
    Alert.alert(
      'Hapus Pelanggan',
      `Apakah Anda yakin ingin menghapus ${name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              // Pastikan session valid sebelum operasi database
              const { session: validSession, error: sessionError } = await ensureValidSession();
              if (sessionError || !validSession) {
                Alert.alert('Error', 'Session tidak valid. Silakan login ulang.');
                return;
              }

              // Wrapper untuk operasi database dengan retry jika expired session
              const performDelete = async (retryCount = 0): Promise<void> => {
                try {
                  const { error } = await supabase.from('customers').delete().eq('id', id);
                  if (error) throw error;
                  await loadData();
                } catch (error: any) {
                  // Cek apakah error karena expired session
                  const isExpiredSession = 
                    error?.message?.includes('expired') ||
                    error?.message?.includes('Invalid JWT') ||
                    error?.message?.includes('JWT') ||
                    error?.code === 'PGRST301' ||
                    error?.status === 401;

                  if (isExpiredSession && retryCount < 1) {
                    // Coba refresh session dan retry sekali
                    console.log('Session expired during delete, refreshing and retrying...');
                    const { session: refreshedSession, error: refreshError } = await ensureValidSession();
                    
                    if (refreshError || !refreshedSession) {
                      throw new Error('Session expired. Silakan login ulang.');
                    }

                    // Retry operasi setelah refresh
                    return await performDelete(retryCount + 1);
                  }
                  
                  throw error;
                }
              };

              await performDelete();
            } catch (error: any) {
              console.error('Error deleting customer:', error);
              // Cek apakah error terkait dengan expired session
              if (error?.message?.includes('expired') || error?.message?.includes('Invalid JWT') || error?.status === 401) {
                Alert.alert('Error', 'Session expired. Silakan login ulang.');
              } else {
                Alert.alert('Error', 'Gagal menghapus pelanggan');
              }
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      package_id: '',
      sales_id: '',
      due_date: '1',
      status: 'active',
    });
  };

  if (isLoading) {
    return (
      <PageLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ios16Palette.accentBlue} />
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Header title="Manajemen Pelanggan" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Button
          title="Tambah Pelanggan"
          onPress={() => {
            resetForm();
            setIsModalVisible(true);
          }}
          style={styles.addButton}
        />

        {customers.map((customer) => (
          <Card key={customer.id} style={styles.customerCard}>
            <View style={styles.customerInfo}>
              <Text style={[ios16Typography.headline, styles.customerName]}>{customer.name}</Text>
              <Text style={[ios16Typography.body, styles.customerDetail]}>📞 {customer.phone}</Text>
              {customer.email && (
                <Text style={[ios16Typography.body, styles.customerDetail]}>✉️ {customer.email}</Text>
              )}
              <Text style={[ios16Typography.body, styles.customerDetail]}>📍 {customer.address}</Text>
              <View style={styles.meta}>
                <Text style={[ios16Typography.caption, styles.metaText]}>
                  Paket: {customer.packages?.name || 'N/A'}
                </Text>
                <Text style={[ios16Typography.caption, styles.metaText]}>
                  Sales: {customer.user_profiles?.full_name || 'N/A'}
                </Text>
                <Text style={[ios16Typography.caption, styles.metaText]}>
                  Jatuh Tempo: Tanggal {customer.due_date}
                </Text>
                <Text style={[ios16Typography.caption, styles.metaText]}>
                  Status: {customer.status}
                </Text>
              </View>
            </View>
            <View style={styles.actions}>
              <Button
                title="Edit"
                onPress={() => handleEdit(customer)}
                variant="secondary"
                style={styles.actionButton}
              />
              <Button
                title="Hapus"
                onPress={() => handleDelete(customer.id, customer.name)}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>
          </Card>
        ))}

        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <Card style={styles.modalContent}>
              <ScrollView>
                <Text style={[ios16Typography.largeTitle, styles.modalTitle]}>
                  {editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
                </Text>

                <View style={styles.form}>
                  <View style={styles.field}>
                    <Text style={ios16Typography.subheadline}>Nama *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      placeholder="Nama pelanggan"
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
                    {isLoadingPackages ? (
                      <View style={styles.emptyState}>
                        <ActivityIndicator size="small" color={ios16Palette.accentBlue} />
                        <Text style={[ios16Typography.caption, styles.emptyStateText, { marginTop: 8 }]}>
                          Memuat paket...
                        </Text>
                      </View>
                    ) : packages.length === 0 ? (
                      <View style={styles.emptyState}>
                        <Text style={[ios16Typography.body, styles.emptyStateText]}>
                          Tidak ada paket tersedia ({packages.length} paket ditemukan).
                        </Text>
                        <Text style={[ios16Typography.caption, styles.emptyStateText, { marginTop: 8 }]}>
                          Pastikan ada paket dengan status aktif (is_active = true) di database.
                          Buka browser console (F12) untuk detail error.
                        </Text>
                      </View>
                    ) : (
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
                    )}
                  </View>

                  <View style={styles.field}>
                    <Text style={ios16Typography.subheadline}>Sales *</Text>
                    <View style={styles.selectContainer}>
                      {sales.map((sale) => (
                        <Pressable
                          key={sale.id}
                          style={[
                            styles.selectOption,
                            formData.sales_id === sale.user_id && styles.selectOptionActive,
                          ]}
                          onPress={() => setFormData({ ...formData, sales_id: sale.user_id })}
                        >
                          <Text
                            style={[
                              ios16Typography.body,
                              formData.sales_id === sale.user_id && styles.selectOptionTextActive,
                            ]}
                          >
                            {sale.full_name || 'N/A'}
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

                  <View style={styles.field}>
                    <Text style={ios16Typography.subheadline}>Status</Text>
                    <View style={styles.selectContainer}>
                      {['active', 'inactive', 'suspended'].map((status) => (
                        <Pressable
                          key={status}
                          style={[
                            styles.selectOption,
                            formData.status === status && styles.selectOptionActive,
                          ]}
                          onPress={() => setFormData({ ...formData, status })}
                        >
                          <Text
                            style={[
                              ios16Typography.body,
                              formData.status === status && styles.selectOptionTextActive,
                            ]}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
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
              </ScrollView>
            </Card>
          </View>
        </Modal>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
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
  customerCard: {
    gap: ios16Spacing.md,
  },
  customerInfo: {
    gap: ios16Spacing.xs,
  },
  customerName: {
    color: ios16Palette.textPrimaryLight80,
  },
  customerDetail: {
    color: ios16Palette.textPrimaryLight80,
  },
  meta: {
    marginTop: ios16Spacing.xs,
    gap: ios16Spacing.xs,
  },
  metaText: {
    color: ios16Palette.textQuaternaryLight,
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
  emptyState: {
    padding: ios16Spacing.md,
    borderRadius: ios16Radii.card,
    backgroundColor: ios16Palette.backgroundMutedLight,
    borderWidth: 1,
    borderColor: ios16Palette.accentBlue + '40',
  },
  emptyStateText: {
    color: ios16Palette.textPrimaryLight80,
    textAlign: 'center',
  },
});
