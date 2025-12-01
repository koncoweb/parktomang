import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/header';
import { ios16Components, ios16Palette, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { formatDate } from '@/lib/utils/date-utils';

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
  created_at: string;
  packages?: { name: string; speed_mbps: number; price_monthly: number };
  user_profiles?: { full_name: string | null };
};

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          packages:package_id(name, speed_mbps, price_monthly),
          user_profiles:sales_id(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setIsLoading(false);
    }
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
      <Header 
        title="Daftar Pelanggan" 
        subtitle={`Total: ${customers.length} pelanggan`}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

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
                  Paket: {customer.packages?.name || 'N/A'} ({customer.packages?.speed_mbps} Mbps)
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
                <Text style={[ios16Typography.caption, styles.metaText]}>
                  Terdaftar: {formatDate(customer.created_at)}
                </Text>
              </View>
            </View>
          </Card>
        ))}

        {customers.length === 0 && (
          <Card>
            <Text style={[ios16Typography.body, styles.emptyText]}>Tidak ada pelanggan</Text>
          </Card>
        )}
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
    color: ios16Palette.textTertiaryLight,
  },
  emptyText: {
    textAlign: 'center',
    color: ios16Palette.textPrimaryLight80,
    padding: ios16Spacing.xl,
  },
});

