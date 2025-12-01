import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/header';
import { ios16Components, ios16Palette, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { formatCurrency, getCurrentMonthYear } from '@/lib/utils/date-utils';
import { useAuth } from '@/hooks/use-auth';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    pendingInvoices: 0,
    verifiedInvoices: 0,
    totalRevenue: 0,
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

      // Pending invoices
      const { count: pendingCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .eq('month', month)
        .eq('year', year);

      // Verified invoices
      const { count: verifiedCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'verified')
        .eq('month', month)
        .eq('year', year);

      // Total revenue
      const { data: verifiedInvoices } = await supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'verified')
        .eq('month', month)
        .eq('year', year);

      const revenue = verifiedInvoices?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;

      setStats({
        totalCustomers: customerCount || 0,
        pendingInvoices: pendingCount || 0,
        verifiedInvoices: verifiedCount || 0,
        totalRevenue: revenue,
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
        title="Dashboard Admin" 
        subtitle={`Selamat datang, ${profile?.full_name || 'Admin'}`}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{stats.totalCustomers}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Total Pelanggan</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{stats.pendingInvoices}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Tagihan Pending</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{stats.verifiedInvoices}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Tagihan Terverifikasi</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={[ios16Typography.title2, styles.statValue]}>{formatCurrency(stats.totalRevenue)}</Text>
            <Text style={[ios16Typography.caption, styles.statLabel]}>Total Pendapatan</Text>
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

