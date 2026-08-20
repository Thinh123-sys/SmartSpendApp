export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  note?: string;
  date: string;
};

export type TransactionInput = Omit<Transaction, 'id'>;

export type TransactionFilter = 'all' | TransactionType;
