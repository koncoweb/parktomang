import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert, Modal, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { PageLayout } from '@/components/page-layout';
import { ios16Palette, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
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
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  customers?: { name: string; phone: string };
};

export default function InvoicesScreen() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [statusInvoice, setStatusInvoice] = useState<Invoice | null>(null);

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

  const openStatusModal = (invoice: Invoice) => {
    setStatusInvoice(invoice);
    setIsStatusModalVisible(true);
  };

  const handleStatusChange = async (newStatus: 'verified' | 'pending') => {
    if (!user || !statusInvoice) return;

    try {
      const updateData: any = {
        status: newStatus,
      };

      if (newStatus === 'verified') {
        updateData.verified_by = user.id;
        updateData.verified_at = new Date().toISOString();
      } else if (newStatus === 'pending') {
        updateData.verified_by = null;
        updateData.verified_at = null;
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', statusInvoice.id);

      if (error) throw error;
      
      await loadInvoices();
      setIsStatusModalVisible(false);
      setStatusInvoice(null);
      
      Alert.alert(
        'Berhasil',
        `Status tagihan berhasil diubah menjadi ${newStatus === 'verified' ? 'Lunas' : 'Belum Lunas'}`
      );
    } catch (error) {
      console.error('Error updating invoice status:', error);
      Alert.alert('Error', 'Gagal mengubah status tagihan');
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
      <Header 
        title="Daftar Tagihan" 
        subtitle={`Total: ${invoices.length} tagihan`}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {invoices.map((invoice) => (
          <Pressable
            key={invoice.id}
            onPress={() => openStatusModal(invoice)}
            style={({ pressed }) => [
              styles.invoiceCardPressable,
              pressed && styles.invoiceCardPressed,
            ]}
          >
            <Card style={styles.invoiceCard}>
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
          </Pressable>
        ))}

        {invoices.length === 0 && (
          <Card>
            <Text style={[ios16Typography.body, styles.emptyText]}>Tidak ada tagihan</Text>
          </Card>
        )}

        <Modal visible={isStatusModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <Card style={styles.modalContent}>
              <Text style={[ios16Typography.largeTitle, styles.modalTitle]}>Ubah Status Tagihan</Text>
              {statusInvoice && (
                <View style={styles.verificationInfo}>
                  <Text style={[ios16Typography.body, styles.verificationText]}>
                    Pelanggan: {statusInvoice.customers?.name}
                  </Text>
                  <Text style={[ios16Typography.body, styles.verificationText]}>
                    Periode: {formatMonthYear(statusInvoice.month, statusInvoice.year)}
                  </Text>
                  <Text style={[ios16Typography.body, styles.verificationText]}>
                    Jumlah: {formatCurrency(statusInvoice.amount)}
                  </Text>
                  <View style={styles.currentStatusContainer}>
                    <Text style={[ios16Typography.body, styles.verificationText]}>
                      Status Saat Ini:
                    </Text>
                    <View
                      style={[
                        styles.statusBadgeInline,
                        { backgroundColor: getStatusColor(statusInvoice.status) + '20' },
                      ]}
                    >
                      <Text style={[ios16Typography.caption, { color: getStatusColor(statusInvoice.status) }]}>
                        {statusInvoice.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.statusActions}>
                <Button
                  title="Tandai Sebagai Lunas"
                  onPress={() => handleStatusChange('verified')}
                  style={[styles.actionButton, styles.lunasButton]}
                />
                <Button
                  title="Tandai Sebagai Belum Lunas"
                  onPress={() => handleStatusChange('pending')}
                  variant="secondary"
                  style={[styles.actionButton, styles.belumLunasButton]}
                />
                <Button
                  title="Batal"
                  onPress={() => {
                    setIsStatusModalVisible(false);
                    setStatusInvoice(null);
                  }}
                  variant="secondary"
                  style={styles.actionButton}
                />
              </View>
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
  invoiceCardPressable: {
    marginBottom: ios16Spacing.md,
  },
  invoiceCardPressed: {
    opacity: 0.8,
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
  verificationInfo: {
    gap: ios16Spacing.sm,
  },
  verificationText: {
    color: ios16Palette.textPrimaryLight80,
  },
  currentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ios16Spacing.sm,
    marginTop: ios16Spacing.xs,
  },
  statusBadgeInline: {
    paddingHorizontal: ios16Spacing.sm,
    paddingVertical: ios16Spacing.xs,
    borderRadius: 8,
  },
  statusActions: {
    gap: ios16Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  lunasButton: {
    backgroundColor: '#34C759',
  },
  belumLunasButton: {
    borderColor: '#FF9500',
  },
});

