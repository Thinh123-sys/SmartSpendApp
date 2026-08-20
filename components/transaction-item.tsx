import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { getCategory } from '@/constants/categories';
import { useTheme } from '@/hooks/use-theme';
import type { Transaction } from '@/types/transaction';
import { formatSignedCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

type TransactionItemProps = {
  transaction: Transaction;
  onPress: () => void;
};

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const { colors } = useTheme();
  const category = getCategory(transaction.category, transaction.type);
  const amountColor = transaction.type === 'income' ? colors.income : colors.expense;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Xem giao dịch ${transaction.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.65 : 1 }]}>
      <View style={[styles.categoryIcon, { backgroundColor: `${category.color}18` }]}>
        <Ionicons name={category.icon} size={21} color={category.color} />
      </View>
      <View style={styles.info}>
        <AppText variant="label" numberOfLines={1}>{transaction.title}</AppText>
        <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
          {category.label} · {formatDate(transaction.date)}
        </AppText>
      </View>
      <View style={styles.amountContainer}>
        <AppText variant="label" color={amountColor} numberOfLines={1} adjustsFontSizeToFit>
          {formatSignedCurrency(transaction.amount, transaction.type)}
        </AppText>
        <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  amountContainer: {
    maxWidth: '43%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
