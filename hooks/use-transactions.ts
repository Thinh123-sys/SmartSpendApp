import { useMemo } from 'react';

import { useApp } from '@/hooks/use-app';

export function useTransactions() {
  const app = useApp();

  const summary = useMemo(() => {
    const totalIncome = app.transactions.reduce(
      (total, transaction) => total + (transaction.type === 'income' ? transaction.amount : 0),
      0
    );
    const totalExpense = app.transactions.reduce(
      (total, transaction) => total + (transaction.type === 'expense' ? transaction.amount : 0),
      0
    );

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [app.transactions]);

  return { ...app, ...summary };
}
