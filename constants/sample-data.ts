import type { Transaction } from '@/types/transaction';

function dateDaysAgo(days: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function createSampleTransactions(): Transaction[] {
  return [
    {
      id: 'sample-salary',
      title: 'Lương tháng này',
      amount: 15_000_000,
      type: 'income',
      category: 'salary',
      note: 'Thu nhập chính',
      date: dateDaysAgo(5),
    },
    {
      id: 'sample-food',
      title: 'Bữa trưa',
      amount: 85_000,
      type: 'expense',
      category: 'food',
      date: dateDaysAgo(1),
    },
    {
      id: 'sample-coffee',
      title: 'Cà phê',
      amount: 35_000,
      type: 'expense',
      category: 'food',
      date: dateDaysAgo(0),
    },
    {
      id: 'sample-transport',
      title: 'Di chuyển',
      amount: 50_000,
      type: 'expense',
      category: 'transport',
      date: dateDaysAgo(2),
    },
  ];
}
