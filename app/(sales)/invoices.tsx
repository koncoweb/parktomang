import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, TextInput, Alert, Modal } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/page-layout';
import { ios16Palette, ios16Radii, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { formatCurrency, formatMonthYear, formatDate } from '@/lib/utils/date-utils';
import { useAuth } from '@/hooks/use-auth';

type Invoice = {
  id: string;
  customer_id: string;
  month: number;
  year: number;
  amount: number;
  status: string;
  payment_date: string | null;
  payment_proof_url: string | null;
  created_at: string;
  customers?: { name: string; phone: string };
};

export default function InvoicesScreen() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentData, setPaymentData] = useState({
    payment_date: '',
    payment_proof_url: '',
  });

  useEffect(() => {
    if (user) {
      loadInvoices();
    }
  }, [user]);

  const loadInvoices = async () => {
    if (!user) return;

    try {
      // Get customer IDs for this sales
      const { data: customers } = await supabase
        .from('customers')
        .select('id')
        .eq('sales_id', user.id);

      if (!customers || customers.length === 0) {
        setInvoices([]);
        return;
      }

      const customerIds = customers.map((c) => c.id);

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers:customer_id(name, phone)
        `)
        .in('customer_id', customerIds)
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

  const handleInputPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentData({
      payment_date: new Date().toISOString().split('T')[0],
      payment_proof_url: '',
    });
    setIsModalVisible(true);
  };

  const handleSavePayment = async () => {
    if (!selectedInvoice) return;

    if (!paymentData.payment_date) {
      Alert.alert('Error', 'Tanggal pembayaran harus diisi');
      return;
    }

    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          payment_date: paymentData.payment_date,
          payment_proof_url: paymentData.payment_proof_url || null,
        })
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      setIsModalVisible(false);
      await loadInvoices();
      Alert.alert('Berhasil', 'Data pembayaran berhasil disimpan. Menunggu verifikasi admin.');
    } catch (error) {
      console.error('Error saving payment:', error);
      Alert.alert('Error', 'Gagal menyimpan data pembayaran');
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
          <Text style={ios16Typography.largeTitle}>Tagihan Pelanggan</Text>
        </View>

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
            </View>
            {invoice.status === 'pending' && (
              <Button
                title="Input Pembayaran"
                onPress={() => handleInputPayment(invoice)}
                style={styles.actionButton}
              />
            )}
          </Card>
        ))}

        {invoices.length === 0 && (
          <Card>
            <Text style={[ios16Typography.body, styles.emptyText]}>Tidak ada tagihan</Text>
          </Card>
        )}

        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <Card style={styles.modalContent}>
              <Text style={[ios16Typography.largeTitle, styles.modalTitle]}>Input Pembayaran</Text>
              {selectedInvoice && (
                <View style={styles.form}>
                  <View style={styles.field}>
                    <Text style={ios16Typography.subheadline}>Pelanggan</Text>
                    <Text style={[ios16Typography.body, styles.infoText]}>
                      {selectedInvoice.customers?.name}
                    </Text>
                  </View>

                  <View style={styles.field}>
                    <Text style={ios16Typography.subheadline}>Periode</Text>
                    <Text style={[ios16Typography.body, styles.infoText]}>
                      {formatMonthYear(selectedInvoice.month, selectedInvoice.year)}
                    </Text>
                  </View>

                  <View style={styles.field}>
                    <Text style={ios16Typography.subheadline}>Jumlah</Text>
                    <Text style={[ios16Typography.body, styles.infoText]}>
                      {formatCurrency(selectedInvoice.amount)}
                    </Text>
                  </View>

                  <View style={styles.field}>
                    <Text style={ios16Typography.subheadline}>Tanggal Pembayaran *</Text>
                    <TextInput
                      style={styles.input}
                      value={paymentData.payment_date}
                      onChangeText={(text) => setPaymentData({ ...paymentData, payment_date: text })}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={ios16Palette.textQuaternaryLight}
                    />
                  </View>

                  <View style={styles.field}>
                    <Text style={ios16Typography.subheadline}>URL Bukti Transfer</Text>
                    <TextInput
                      style={styles.input}
                      value={paymentData.payment_proof_url}
                      onChangeText={(text) => setPaymentData({ ...paymentData, payment_proof_url: text })}
                      placeholder="https://..."
                      placeholderTextColor={ios16Palette.textQuaternaryLight}
                    />
                  </View>

                  <View style={styles.actions}>
                    <Button
                      title="Batal"
                      onPress={() => setIsModalVisible(false)}
                      variant="secondary"
                      style={styles.actionButton}
                    />
                    <Button title="Simpan" onPress={handleSavePayment} style={styles.actionButton} />
                  </View>
                </View>
              )}
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
    color: ios16Palette.textQuaternaryLight,
  },
  actionButton: {
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    color: ios16Palette.textPrimaryLight80,
    padding: ios16Spacing.xl,
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
    gap: ios16Spacing.lg,
  },
  modalTitle: {
    color: ios16Palette.textPrimaryLight80,
  },
  form: {
    gap: ios16Spacing.md,
  },
  field: {
    gap: ios16Spacing.xs,
  },
  infoText: {
    color: ios16Palette.textPrimaryLight80,
  },
  input: {
    backgroundColor: ios16Palette.backgroundCardLightNew,
    borderRadius: ios16Radii.card,
    paddingHorizontal: ios16Spacing.lg,
    paddingVertical: ios16Spacing.md,
    color: ios16Palette.textPrimaryLight80,
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    gap: ios16Spacing.md,
    marginTop: ios16Spacing.md,
  },
});

