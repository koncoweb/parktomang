import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/header';
import { ios16Components, ios16Palette, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { formatCurrency, getCurrentMonthYear } from '@/lib/utils/date-utils';
import { useAuth } from '@/hooks/use-auth';

export default function SalesDashboard() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({
    myCustomers: 0,
    myInvoices: 0,
    myCommissions: 0,
    pendingInvoices: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      const { month, year } = getCurrentMonthYear();

      // My customers
      const { count: customerCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('sales_id', user.id);

      // My invoices this month
      const { count: invoiceCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('month', month)
        .eq('year', year)
        .in('customer_id', 
          (await supabase.from('customers').select('id').eq('sales_id', user.id)).data?.map(c => c.id) || []
        );

      // My commissions this month
      const { data: commissions } = await supabase
        .from('commissions')
        .select('amount')
        .eq('sales_id', user.id)
        .eq('month', month)
        .eq('year', year);

      const totalCommissions = commissions?.reduce((sum, comm) => sum + Number(comm.amount), 0) || 0;

      // Pending invoices
      const { count: pendingCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .eq('month', month)
        .eq('year', year)
        .in('customer_id',
          (await supabase.from('customers').select('id').eq('sales_id', user.id)).data?.map(c => c.id) || []
        );

      setStats({
        myCustomers: customerCount || 0,
        myInvoices: invoiceCount || 0,
        myCommissions: totalCommissions,
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
        title="Dashboard Sales" 
        subtitle={`Selamat datang, ${profile?.full_name || 'Sales'}`}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{stats.myCustomers}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Pelanggan Saya</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{stats.myInvoices}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Tagihan Bulan Ini</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{formatCurrency(stats.myCommissions)}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Komisi Bulan Ini</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{stats.pendingInvoices}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Tagihan Pending</Text>
          </Card>
        </View>
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

