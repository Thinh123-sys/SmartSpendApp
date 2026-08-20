import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

import type { TransactionType } from '@/types/transaction';

export type Category = {
  id: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  color: string;
  type: TransactionType;
};

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', label: 'Ăn uống', icon: 'restaurant-outline', color: '#EF8354', type: 'expense' },
  { id: 'transport', label: 'Di chuyển', icon: 'bus-outline', color: '#4F86C6', type: 'expense' },
  { id: 'shopping', label: 'Mua sắm', icon: 'bag-handle-outline', color: '#9B5DE5', type: 'expense' },
  { id: 'entertainment', label: 'Giải trí', icon: 'game-controller-outline', color: '#F15BB5', type: 'expense' },
  { id: 'bills', label: 'Hóa đơn', icon: 'receipt-outline', color: '#F5B700', type: 'expense' },
  { id: 'education', label: 'Giáo dục', icon: 'school-outline', color: '#00A6A6', type: 'expense' },
  { id: 'health', label: 'Sức khỏe', icon: 'medkit-outline', color: '#2A9D8F', type: 'expense' },
  { id: 'expense-other', label: 'Khác', icon: 'ellipsis-horizontal-outline', color: '#718096', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', label: 'Lương', icon: 'wallet-outline', color: '#16865F', type: 'income' },
  { id: 'bonus', label: 'Thưởng', icon: 'trophy-outline', color: '#F5B700', type: 'income' },
  { id: 'freelance', label: 'Freelance', icon: 'laptop-outline', color: '#4F86C6', type: 'income' },
  { id: 'gift', label: 'Quà tặng', icon: 'gift-outline', color: '#F15BB5', type: 'income' },
  { id: 'income-other', label: 'Khác', icon: 'ellipsis-horizontal-outline', color: '#718096', type: 'income' },
];

export const CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoriesByType(type: TransactionType) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function getCategory(categoryId: string, type?: TransactionType): Category {
  const categories = type ? getCategoriesByType(type) : CATEGORIES;
  return (
    categories.find((category) => category.id === categoryId) ?? {
      id: categoryId,
      label: 'Khác',
      icon: 'ellipsis-horizontal-outline',
      color: '#718096',
      type: type ?? 'expense',
    }
  );
}
