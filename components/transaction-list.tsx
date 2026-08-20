import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { TransactionItem } from '@/components/transaction-item';
import { useTheme } from '@/hooks/use-theme';
import type { Transaction } from '@/types/transaction';

type TransactionListProps = {
  transactions: Transaction[];
  onPressItem: (transaction: Transaction) => void;
  onAdd?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function TransactionList({
  transactions,
  onPressItem,
  onAdd,
  emptyTitle = 'Chưa có giao dịch',
  emptyDescription = 'Thêm giao dịch đầu tiên để bắt đầu theo dõi tài chính của bạn.',
}: TransactionListProps) {
  const { colors } = useTheme();

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem transaction={item} onPress={() => onPressItem(item)} />}
      ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
      contentContainerStyle={[styles.content, transactions.length === 0 && styles.emptyContent]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={onAdd ? 'Thêm giao dịch' : undefined}
          onAction={onAdd}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 57,
  },
});
