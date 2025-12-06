import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/page-layout';
import { ios16Palette, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
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
  created_at: string;
  packages?: { name: string; speed_mbps: number; price_monthly: number };
};

export default function CustomersScreen() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCustomers();
    }
  }, [user]);

  const loadCustomers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          packages:package_id(name, speed_mbps, price_monthly)
        `)
        .eq('sales_id', user.id)
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
      <PageLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ios16Palette.accentBlue} />
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={ios16Typography.largeTitle}>Pelanggan Saya</Text>
          <Link href="/(sales)/customers/new" asChild>
            <Button title="Daftarkan Pelanggan Baru" style={styles.addButton} />
          </Link>
        </View>

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
            <Text style={[ios16Typography.body, styles.emptyText]}>Belum ada pelanggan</Text>
            <Link href="/(sales)/customers/new" asChild>
              <Button title="Daftarkan Pelanggan Pertama" style={styles.emptyButton} />
            </Link>
          </Card>
        )}
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
    color: ios16Palette.textTertiaryLight,
  },
  emptyText: {
    textAlign: 'center',
    color: ios16Palette.textPrimaryLight80,
    padding: ios16Spacing.xl,
    marginBottom: ios16Spacing.md,
  },
  emptyButton: {
    width: 'auto',
    alignSelf: 'center',
  },
});

