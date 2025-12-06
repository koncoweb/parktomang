import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/header';
import { PageLayout } from '@/components/page-layout';
import { ios16Palette, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { formatCurrency, getCurrentMonthYear } from '@/lib/utils/date-utils';
import { useAuth } from '@/hooks/use-auth';

export default function OwnerDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    totalCommissions: 0,
    pendingInvoices: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { month, year } = getCurrentMonthYear();

      // Total customers
      const { count: customerCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // Total invoices this month
      const { count: invoiceCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('month', month)
        .eq('year', year);

      // Total revenue (verified invoices)
      const { data: verifiedInvoices } = await supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'verified')
        .eq('month', month)
        .eq('year', year);

      const revenue = verifiedInvoices?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;

      // Total commissions this month
      const { data: commissions } = await supabase
        .from('commissions')
        .select('amount')
        .eq('month', month)
        .eq('year', year);

      const totalCommissions = commissions?.reduce((sum, comm) => sum + Number(comm.amount), 0) || 0;

      // Pending invoices
      const { count: pendingCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .eq('month', month)
        .eq('year', year);

      setStats({
        totalCustomers: customerCount || 0,
        totalInvoices: invoiceCount || 0,
        totalRevenue: revenue,
        totalCommissions: totalCommissions,
        pendingInvoices: pendingCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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
      <Header 
        title="Dashboard Owner" 
        subtitle={`Selamat datang, ${profile?.full_name || 'Owner'}`}
      />
      <View style={styles.scrollContent}>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{stats.totalCustomers}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Total Pelanggan</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{stats.totalInvoices}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Tagihan Bulan Ini</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{formatCurrency(stats.totalRevenue)}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Total Pendapatan</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{formatCurrency(stats.totalCommissions)}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Total Komisi</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{stats.pendingInvoices}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Tagihan Pending</Text>
          </Card>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: ios16Spacing.lg,
    gap: ios16Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ios16Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: ios16Spacing.lg,
  },
  statValue: {
    color: ios16Palette.textPrimaryLight80,
    marginBottom: ios16Spacing.xs,
  },
  statLabel: {
    color: ios16Palette.textPrimaryLight80,
    textAlign: 'center',
  },
});

