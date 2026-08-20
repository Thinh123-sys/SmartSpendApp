import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryChip } from '@/components/category-chip';
import { TransactionList } from '@/components/transaction-list';
import { AppText } from '@/components/ui/app-text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { CATEGORIES, getCategory, getCategoriesByType } from '@/constants/categories';
import { useTheme } from '@/hooks/use-theme';
import { useTransactions } from '@/hooks/use-transactions';
import type { TransactionFilter } from '@/types/transaction';
import { sortByNewest } from '@/utils/date';

const FILTERS: { value: TransactionFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'income', label: 'Thu nhập' },
  { value: 'expense', label: 'Chi tiêu' },
];

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const { transactions } = useTransactions();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const visibleCategories = typeFilter === 'all' ? CATEGORIES : getCategoriesByType(typeFilter);
  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi-VN');
    return sortByNewest(transactions).filter((transaction) => {
      const category = getCategory(transaction.category, transaction.type);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        transaction.title.toLocaleLowerCase('vi-VN').includes(normalizedQuery) ||
        category.label.toLocaleLowerCase('vi-VN').includes(normalizedQuery) ||
        transaction.note?.toLocaleLowerCase('vi-VN').includes(normalizedQuery);
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      return Boolean(matchesQuery && matchesType && matchesCategory);
    });
  }, [categoryFilter, query, transactions, typeFilter]);

  function selectType(value: TransactionFilter) {
    setTypeFilter(value);
    if (value !== 'all' && categoryFilter !== 'all') {
      const categoryStillVisible = getCategoriesByType(value).some((item) => item.id === categoryFilter);
      if (!categoryStillVisible) setCategoryFilter('all');
    }
  }

  const hasFilters = query.trim().length > 0 || typeFilter !== 'all' || categoryFilter !== 'all';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.headerContent}>
        <ScreenHeader
          eyebrow={`${transactions.length} giao dịch`}
          title="Giao dịch"
          actionIcon="add"
          actionLabel="Thêm giao dịch"
          onAction={() => router.push('/transaction/add')}
        />

        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm tên, danh mục, ghi chú..."
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.text }]}
            returnKeyType="search"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={19} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <View style={[styles.filterRow, { backgroundColor: colors.surfaceMuted }]}>
          {FILTERS.map((filter) => {
            const selected = typeFilter === filter.value;
            return (
              <Pressable
                key={filter.value}
                onPress={() => selectType(filter.value)}
                style={({ pressed }) => [
                  styles.filterButton,
                  { backgroundColor: selected ? colors.surface : 'transparent', opacity: pressed ? 0.7 : 1 },
                ]}>
                <AppText variant="label" color={selected ? colors.primary : colors.textSecondary}>{filter.label}</AppText>
              </Pressable>
            );
          })}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          <Pressable
            onPress={() => setCategoryFilter('all')}
            style={({ pressed }) => [
              styles.allCategory,
              {
                backgroundColor: categoryFilter === 'all' ? colors.primarySoft : colors.surface,
                borderColor: categoryFilter === 'all' ? colors.primary : colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <Ionicons name="apps-outline" size={16} color={categoryFilter === 'all' ? colors.primary : colors.textSecondary} />
            <AppText variant="caption" color={categoryFilter === 'all' ? colors.primary : colors.textSecondary}>Mọi danh mục</AppText>
          </Pressable>
          {visibleCategories.map((category) => (
            <CategoryChip
              compact
              key={category.id}
              category={category}
              selected={categoryFilter === category.id}
              onPress={() => setCategoryFilter(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={[styles.listShell, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TransactionList
          transactions={filteredTransactions}
          onPressItem={(transaction) =>
            router.push({ pathname: '/transaction/[id]', params: { id: transaction.id } })
          }
          onAdd={!hasFilters ? () => router.push('/transaction/add') : undefined}
          emptyTitle={hasFilters ? 'Không tìm thấy kết quả' : undefined}
          emptyDescription={
            hasFilters ? 'Thử thay đổi từ khóa hoặc bộ lọc để xem thêm giao dịch.' : undefined
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  headerContent: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 15,
    gap: 14,
  },
  searchBox: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  searchInput: { flex: 1, height: '100%', fontSize: 14 },
  filterRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    gap: 4,
  },
  filterButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categories: { gap: 8, paddingRight: 8 },
  allCategory: {
    minHeight: 36,
    paddingHorizontal: 11,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  listShell: {
    flex: 1,
    borderTopWidth: 1,
    paddingTop: 2,
  },
});
