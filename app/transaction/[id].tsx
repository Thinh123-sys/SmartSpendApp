import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { TransactionForm } from '@/components/transaction-form';
import { AppText } from '@/components/ui/app-text';
import { getCategory } from '@/constants/categories';
import { useTheme } from '@/hooks/use-theme';
import { useTransactions } from '@/hooks/use-transactions';
import type { TransactionInput } from '@/types/transaction';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

export default function TransactionDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { colors } = useTheme();
  const { getTransaction, updateTransaction, deleteTransaction, isReady } = useTransactions();
  const [isEditing, setIsEditing] = useState(false);
  const transaction = id ? getTransaction(id) : undefined;

  if (!isReady) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={[styles.notFound, { backgroundColor: colors.background }]} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Không tìm thấy' }} />
        <EmptyState
          icon="alert-circle-outline"
          title="Giao dịch không tồn tại"
          description="Giao dịch này có thể đã bị xóa hoặc dữ liệu không còn hợp lệ."
          actionLabel="Quay lại"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const input: TransactionInput = {
    title: transaction.title,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    date: transaction.date,
    note: transaction.note,
  };
  const transactionTitle = transaction.title;

  async function handleUpdate(nextInput: TransactionInput) {
    if (!id) return;
    const updated = await updateTransaction(id, nextInput);
    if (!updated) {
      Alert.alert('Không thể cập nhật', 'Giao dịch không còn tồn tại.');
      return;
    }
    setIsEditing(false);
  }

  function confirmDelete() {
    Alert.alert('Xóa giao dịch?', `“${transactionTitle}” sẽ bị xóa vĩnh viễn.`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          if (!id) return;
          void deleteTransaction(id)
            .then((deleted) => {
              if (deleted) router.back();
              else Alert.alert('Không thể xóa', 'Giao dịch không còn tồn tại.');
            })
            .catch(() => Alert.alert('Không thể xóa', 'Đã có lỗi khi lưu dữ liệu. Vui lòng thử lại.'));
        },
      },
    ]);
  }

  if (isEditing) {
    return (
      <>
        <Stack.Screen options={{ title: 'Sửa giao dịch' }} />
        <TransactionForm
          initialValue={input}
          submitLabel="Lưu thay đổi"
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </>
    );
  }

  const category = getCategory(transaction.category, transaction.type);
  const amountColor = transaction.type === 'income' ? colors.income : colors.expense;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Chi tiết giao dịch' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: transaction.type === 'income' ? colors.incomeSoft : colors.expenseSoft }]}>
          <View style={[styles.heroIcon, { backgroundColor: `${category.color}20` }]}>
            <Ionicons name={category.icon} size={29} color={category.color} />
          </View>
          <AppText variant="subtitle" style={styles.heroTitle}>{transaction.title}</AppText>
          <AppText variant="display" color={amountColor} numberOfLines={1} adjustsFontSizeToFit>
            {transaction.type === 'income' ? '+ ' : '- '}{formatCurrency(transaction.amount)}
          </AppText>
          <View style={[styles.typeBadge, { backgroundColor: transaction.type === 'income' ? colors.income : colors.expense }]}>
            <AppText variant="caption" color={colors.white} style={styles.typeText}>
              {transaction.type === 'income' ? 'THU NHẬP' : 'CHI TIÊU'}
            </AppText>
          </View>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <DetailRow icon="pricetag-outline" label="Danh mục" value={category.label} />
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <DetailRow icon="calendar-outline" label="Ngày" value={formatDate(transaction.date)} />
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <DetailRow icon="document-text-outline" label="Ghi chú" value={transaction.note || 'Không có ghi chú'} muted={!transaction.note} />
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => setIsEditing(true)}
            style={({ pressed }) => [styles.editButton, { backgroundColor: colors.primary, opacity: pressed ? 0.76 : 1 }]}>
            <Ionicons name="create-outline" size={20} color={colors.white} />
            <AppText variant="label" color={colors.white}>Sửa giao dịch</AppText>
          </Pressable>
          <Pressable
            onPress={confirmDelete}
            style={({ pressed }) => [styles.deleteButton, { backgroundColor: colors.expenseSoft, opacity: pressed ? 0.7 : 1 }]}>
            <Ionicons name="trash-outline" size={20} color={colors.expense} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  icon,
  label,
  value,
  muted = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  muted?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIcon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>
      <View style={styles.detailCopy}>
        <AppText variant="caption" color={colors.textSecondary}>{label}</AppText>
        <AppText variant="label" color={muted ? colors.textMuted : colors.text}>{value}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { flex: 1, justifyContent: 'center' },
  content: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 44,
    gap: 18,
  },
  hero: {
    borderRadius: 25,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: { textAlign: 'center' },
  typeBadge: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: 9, marginTop: 3 },
  typeText: { fontWeight: '800', letterSpacing: 0.5 },
  detailsCard: { borderRadius: 21, borderWidth: 1, paddingHorizontal: 16 },
  detailRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCopy: { flex: 1, gap: 2 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 52 },
  actions: { flexDirection: 'row', gap: 10 },
  editButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButton: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
