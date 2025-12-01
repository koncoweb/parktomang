import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { ios16Components, ios16Palette, ios16Radii, ios16Spacing, ios16Typography } from '@/constants/ios16TemplateStyles';
import { formatCurrency, formatMonthYear, getCurrentMonthYear } from '@/lib/utils/date-utils';
import { useAuth } from '@/hooks/use-auth';

type Commission = {
  id: string;
  customer_id: string;
  invoice_id: string;
  percentage: number;
  amount: number;
  month: number;
  year: number;
  status: string;
  created_at: string;
  customers?: { name: string };
};

export default function CommissionsScreen() {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYear().month);
  const [selectedYear, setSelectedYear] = useState(getCurrentMonthYear().year);

  useEffect(() => {
    if (user) {
      loadCommissions();
    }
  }, [user, selectedMonth, selectedYear]);

  const loadCommissions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('commissions')
        .select(`
          *,
          customers:customer_id(name)
        `)
        .eq('sales_id', user.id)
        .eq('month', selectedMonth)
        .eq('year', selectedYear)
        .order('created_at', { ascending: false });

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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={ios16Typography.largeTitle}>Komisi Saya</Text>
          <View style={styles.filterContainer}>
            <Text style={ios16Typography.subheadline}>Filter:</Text>
            <View style={styles.filterRow}>
              <TextInput
                style={styles.filterInput}
                value={selectedMonth.toString()}
                onChangeText={(text) => setSelectedMonth(parseInt(text) || 1)}
                keyboardType="numeric"
                placeholder="Bulan"
                placeholderTextColor={ios16Palette.textQuaternaryLight}
              />
              <TextInput
                style={styles.filterInput}
                value={selectedYear.toString()}
                onChangeText={(text) => setSelectedYear(parseInt(text) || new Date().getFullYear())}
                keyboardType="numeric"
                placeholder="Tahun"
                placeholderTextColor={ios16Palette.textQuaternaryLight}
              />
            </View>
          </View>
          <Card style={styles.summaryCard}>
            <Text style={[ios16Typography.caption, styles.summaryLabel]}>
              Total Komisi {formatMonthYear(selectedMonth, selectedYear)}
            </Text>
            <Text style={[ios16Typography.largeTitle, styles.summaryValue]}>
              {formatCurrency(totalCommissions)}
            </Text>
          </Card>
        </View>

        {commissions.map((commission) => (
          <Card key={commission.id} style={styles.commissionCard}>
            <View style={styles.commissionInfo}>
              <Text style={[ios16Typography.headline, styles.customerName]}>
                {commission.customers?.name || 'N/A'}
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
            <Text style={[ios16Typography.body, styles.emptyText]}>
              Tidak ada komisi untuk periode ini
            </Text>
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
  header: {
    marginBottom: ios16Spacing.md,
    gap: ios16Spacing.md,
  },
  filterContainer: {
    gap: ios16Spacing.xs,
  },
  filterRow: {
    flexDirection: 'row',
    gap: ios16Spacing.md,
  },
  filterInput: {
    flex: 1,
    backgroundColor: ios16Palette.backgroundCardLightNew,
    borderRadius: ios16Radii.card,
    paddingHorizontal: ios16Spacing.lg,
    paddingVertical: ios16Spacing.md,
    color: ios16Palette.textPrimaryLight80,
    fontSize: 11,
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
    color: ios16Palette.textQuaternaryLight,
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

