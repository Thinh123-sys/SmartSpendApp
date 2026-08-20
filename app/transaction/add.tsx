import { router } from 'expo-router';

import { TransactionForm } from '@/components/transaction-form';
import { useTransactions } from '@/hooks/use-transactions';
import type { TransactionInput } from '@/types/transaction';

export default function AddTransactionScreen() {
  const { addTransaction } = useTransactions();

  async function handleSubmit(input: TransactionInput) {
    await addTransaction(input);
    router.back();
  }

  return <TransactionForm submitLabel="Lưu giao dịch" onSubmit={handleSubmit} />;
}
