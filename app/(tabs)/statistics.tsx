import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { AppText } from '@/components/ui/app-text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { getCategory } from '@/constants/categories';
import { useTheme } from '@/hooks/use-theme';
import { useTransactions } from '@/hooks/use-transactions';
import { formatCurrency } from '@/utils/currency';

type CategoryTotal = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  amount: number;
  percentage: number;
};

export default function StatisticsScreen() {
  const { colors } = useTheme();
  const { transactions, totalIncome, totalExpense, balance } = useTransactions();

  const categoryTotals = useMemo<CategoryTotal[]>(() => {
    const totals = new Map<string, number>();
    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount);
      }
    });

    return [...totals.entries()]
      .map(([id, amount]) => {
        const category = getCategory(id, 'expense');
        return {
          id,
          label: category.label,
          icon: category.icon,
          color: category.color,
          amount,
          percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [totalExpense, transactions]);

  const topCategory = categoryTotals[0];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Bức tranh tài chính" title="Thống kê" />

        <View style={styles.summaryGrid}>
          <SummaryCard label="Thu nhập" amount={totalIncome} icon="arrow-down" color={colors.income} background={colors.incomeSoft} />
          <SummaryCard label="Chi tiêu" amount={totalExpense} icon="arrow-up" color={colors.expense} background={colors.expenseSoft} />
          <View style={[styles.balanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.balanceTitle}>
              <View style={[styles.miniIcon, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name="wallet-outline" size={19} color={colors.primary} />
              </View>
              <AppText variant="label" color={colors.textSecondary}>Số dư</AppText>
            </View>
            <AppText variant="title" color={balance >= 0 ? colors.primary : colors.expense} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(balance)}
            </AppText>
          </View>
        </View>

        {topCategory ? (
          <View style={[styles.topCard, { backgroundColor: colors.primary }]}>
            <View style={[styles.topIcon, { backgroundColor: 'rgba(255,255,255,0.14)' }]}>
              <Ionicons name={topCategory.icon} size={25} color={colors.white} />
            </View>
            <View style={styles.topCopy}>
              <AppText variant="caption" color="rgba(255,255,255,0.72)">DANH MỤC CHI NHIỀU NHẤT</AppText>
              <AppText variant="subtitle" color={colors.white}>{topCategory.label}</AppText>
            </View>
            <View style={styles.topAmount}>
              <AppText variant="label" color={colors.white}>{formatCurrency(topCategory.amount)}</AppText>
              <AppText variant="caption" color="rgba(255,255,255,0.72)">{topCategory.percentage.toFixed(1)}%</AppText>
            </View>
          </View>
        ) : null}

        <View style={styles.sectionTitle}>
          <AppText variant="subtitle">Chi tiêu theo danh mục</AppText>
          <AppText variant="caption" color={colors.textSecondary}>{categoryTotals.length} danh mục</AppText>
        </View>

        <View style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {categoryTotals.length === 0 ? (
            <EmptyState
              icon="pie-chart-outline"
              title="Chưa có dữ liệu chi tiêu"
              description="Thống kê theo danh mục sẽ xuất hiện sau khi bạn thêm khoản chi."
            />
          ) : (
            categoryTotals.map((item, index) => (
              <View key={item.id} style={[styles.categoryItem, index > 0 && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${item.color}18` }]}>
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <View style={styles.categoryCopy}>
                    <AppText variant="label">{item.label}</AppText>
                    <AppText variant="caption" color={colors.textSecondary}>{item.percentage.toFixed(1)}% tổng chi</AppText>
                  </View>
                  <AppText variant="label">{formatCurrency(item.amount)}</AppText>
                </View>
                <View style={[styles.track, { backgroundColor: colors.surfaceMuted }]}>
                  <View style={[styles.progress, { width: `${Math.max(item.percentage, 2)}%`, backgroundColor: item.color }]} />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({
  label,
  amount,
  icon,
  color,
  background,
}: {
  label: string;
  amount: number;
  icon: 'arrow-down' | 'arrow-up';
  color: string;
  background: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.miniIcon, { backgroundColor: background }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <AppText variant="caption" color={colors.textSecondary}>{label}</AppText>
      <AppText variant="label" color={color} numberOfLines={1} adjustsFontSizeToFit>{formatCurrency(amount)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 110,
    gap: 19,
  },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  summaryCard: {
    flexGrow: 1,
    flexBasis: 145,
    borderWidth: 1,
    borderRadius: 19,
    padding: 15,
    gap: 7,
  },
  miniIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 19,
    padding: 16,
    gap: 11,
  },
  balanceTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topCard: {
    borderRadius: 21,
    minHeight: 92,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCopy: { flex: 1, gap: 2 },
  topAmount: { alignItems: 'flex-end', gap: 2, maxWidth: '35%' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  categoryCard: { borderRadius: 21, borderWidth: 1, paddingHorizontal: 16 },
  categoryItem: { paddingVertical: 16, gap: 11 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  categoryIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCopy: { flex: 1, gap: 1 },
  track: { height: 7, borderRadius: 4, overflow: 'hidden' },
  progress: { height: '100%', borderRadius: 4 },
});
