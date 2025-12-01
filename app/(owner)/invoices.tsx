import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/header';
import { ios16Components, ios16Palette, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { formatCurrency, formatMonthYear } from '@/lib/utils/date-utils';

type Invoice = {
  id: string;
  customer_id: string;
  month: number;
  year: number;
  amount: number;
  status: string;
  payment_date: string | null;
  verified_at: string | null;
  created_at: string;
  customers?: { name: string; phone: string };
};

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers:customer_id(name, phone)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return '#34C759';
      case 'paid':
        return '#007AFF';
      case 'pending':
        return '#FF9500';
      case 'overdue':
        return '#FF3B30';
      default:
        return ios16Palette.textPrimaryLight80;
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
        title="Daftar Tagihan" 
        subtitle={`Total: ${invoices.length} tagihan`}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {invoices.map((invoice) => (
          <Card key={invoice.id} style={styles.invoiceCard}>
            <View style={styles.invoiceInfo}>
              <View style={styles.invoiceHeader}>
                <Text style={[ios16Typography.headline, styles.customerName]}>
                  {invoice.customers?.name || 'N/A'}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(invoice.status) + '20' },
                  ]}
                >
                  <Text style={[ios16Typography.caption, { color: getStatusColor(invoice.status) }]}>
                    {invoice.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={[ios16Typography.body, styles.invoiceDetail]}>
                {formatMonthYear(invoice.month, invoice.year)}
              </Text>
              <Text style={[ios16Typography.title2, styles.amount]}>
                {formatCurrency(invoice.amount)}
              </Text>
              {invoice.payment_date && (
                <Text style={[ios16Typography.caption, styles.metaText]}>
                  Tanggal Bayar: {formatDate(invoice.payment_date)}
                </Text>
              )}
              {invoice.verified_at && (
                <Text style={[ios16Typography.caption, styles.metaText]}>
                  Diverifikasi: {formatDate(invoice.verified_at)}
                </Text>
              )}
            </View>
          </Card>
        ))}

        {invoices.length === 0 && (
          <Card>
            <Text style={[ios16Typography.body, styles.emptyText]}>Tidak ada tagihan</Text>
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
  invoiceCard: {
    gap: ios16Spacing.md,
  },
  invoiceInfo: {
    gap: ios16Spacing.xs,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    color: ios16Palette.textPrimaryLight80,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: ios16Spacing.sm,
    paddingVertical: ios16Spacing.xs,
    borderRadius: 8,
  },
  invoiceDetail: {
    color: ios16Palette.textPrimaryLight80,
  },
  amount: {
    color: ios16Palette.accentBlue,
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

