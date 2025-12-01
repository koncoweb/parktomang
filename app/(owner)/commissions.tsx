import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/header';
import { ios16Components, ios16Palette, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { formatCurrency, formatMonthYear } from '@/lib/utils/date-utils';

type Commission = {
  id: string;
  sales_id: string;
  customer_id: string;
  invoice_id: string;
  percentage: number;
  amount: number;
  month: number;
  year: number;
  status: string;
  created_at: string;
  user_profiles?: { full_name: string | null };
  customers?: { name: string };
};

export default function CommissionsScreen() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    try {
      const { data, error } = await supabase
        .from('commissions')
        .select(`
          *,
          user_profiles:sales_id(full_name),
          customers:customer_id(name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setCommissions(data || []);
    } catch (error) {
      console.error('Error loading commissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalCommissions = commissions.reduce((sum, comm) => sum + Number(comm.amount), 0);

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
      <Header title="Daftar Komisi" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard}>
          <Text style={[ios16Typography.caption, styles.summaryLabel]}>Total Komisi</Text>
          <Text style={[ios16Typography.largeTitle, styles.summaryValue]}>
            {formatCurrency(totalCommissions)}
          </Text>
        </Card>

        {commissions.map((commission) => (
          <Card key={commission.id} style={styles.commissionCard}>
            <View style={styles.commissionInfo}>
              <Text style={[ios16Typography.headline, styles.salesName]}>
                {commission.user_profiles?.full_name || 'N/A'}
              </Text>
              <Text style={[ios16Typography.body, styles.customerName]}>
                Pelanggan: {commission.customers?.name || 'N/A'}
              </Text>
              <Text style={[ios16Typography.body, styles.period]}>
                {formatMonthYear(commission.month, commission.year)}
              </Text>
              <View style={styles.commissionDetails}>
                <Text style={[ios16Typography.caption, styles.detailText]}>
                  Persentase: {commission.percentage}%
                </Text>
                <Text style={[ios16Typography.title2, styles.amount]}>
                  {formatCurrency(commission.amount)}
                </Text>
              </View>
              <Text style={[ios16Typography.caption, styles.status]}>
                Status: {commission.status}
              </Text>
            </View>
          </Card>
        ))}

        {commissions.length === 0 && (
          <Card>
            <Text style={[ios16Typography.body, styles.emptyText]}>Tidak ada komisi</Text>
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
  summaryCard: {
    alignItems: 'center',
    padding: ios16Spacing.lg,
  },
  summaryLabel: {
    color: ios16Palette.textPrimaryLight80,
    marginBottom: ios16Spacing.xs,
  },
  summaryValue: {
    color: ios16Palette.accentBlue,
  },
  commissionCard: {
    gap: ios16Spacing.md,
  },
  commissionInfo: {
    gap: ios16Spacing.xs,
  },
  salesName: {
    color: ios16Palette.textPrimaryLight80,
  },
  customerName: {
    color: ios16Palette.textPrimaryLight80,
  },
  period: {
    color: ios16Palette.textPrimaryLight80,
  },
  commissionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ios16Spacing.xs,
  },
  detailText: {
    color: ios16Palette.textTertiaryLight,
  },
  amount: {
    color: ios16Palette.accentBlue,
  },
  status: {
    color: ios16Palette.textPrimaryLight80,
  },
  emptyText: {
    textAlign: 'center',
    color: ios16Palette.textPrimaryLight80,
    padding: ios16Spacing.xl,
  },
});

