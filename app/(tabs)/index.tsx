import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BalanceCard } from '@/components/balance-card';
import { EmptyState } from '@/components/empty-state';
import { TransactionItem } from '@/components/transaction-item';
import { AppText } from '@/components/ui/app-text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useTheme } from '@/hooks/use-theme';
import { useTransactions } from '@/hooks/use-transactions';
import { sortByNewest } from '@/utils/date';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { transactions, balance, totalIncome, totalExpense, isReady } = useTransactions();
  const recentTransactions = sortByNewest(transactions).slice(0, 5);

  if (!isReady) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow={getGreeting()} title="SmartSpend" />
        <BalanceCard balance={balance} income={totalIncome} expense={totalExpense} />

        <Pressable
          onPress={() => router.push('/transaction/add')}
          style={({ pressed }) => [
            styles.quickAction,
            { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.72 : 1 },
          ]}>
          <View style={[styles.quickIcon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </View>
          <View style={styles.quickCopy}>
            <AppText variant="label">Thêm giao dịch</AppText>
            <AppText variant="caption" color={colors.textSecondary}>Ghi lại thu nhập hoặc chi tiêu mới</AppText>
          </View>
          <Ionicons name="chevron-forward" size={19} color={colors.textMuted} />
        </Pressable>

        <View style={styles.sectionHeader}>
          <AppText variant="subtitle">Giao dịch gần đây</AppText>
          {transactions.length > 0 ? (
            <Pressable onPress={() => router.push('/(tabs)/transactions')} hitSlop={10}>
              <AppText variant="label" color={colors.primary}>Xem tất cả</AppText>
            </Pressable>
          ) : null}
        </View>

        <View style={[styles.listCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {recentTransactions.length === 0 ? (
            <EmptyState
              title="Bắt đầu quản lý tài chính"
              description="Các giao dịch mới sẽ xuất hiện tại đây."
              actionLabel="Thêm giao dịch"
              onAction={() => router.push('/transaction/add')}
            />
          ) : (
            recentTransactions.map((transaction, index) => (
              <View key={transaction.id}>
                <TransactionItem
                  transaction={transaction}
                  onPress={() => router.push({ pathname: '/transaction/[id]', params: { id: transaction.id } })}
                />
                {index < recentTransactions.length - 1 ? (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                ) : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 110,
    gap: 21,
  },
  quickAction: {
    minHeight: 72,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCopy: { flex: 1, gap: 2 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 3,
  },
  listCard: {
    borderRadius: 21,
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 57,
  },
});
