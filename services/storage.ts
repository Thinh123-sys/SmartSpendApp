import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Transaction, TransactionType } from '@/types/transaction';

const STORAGE_KEYS = {
  transactions: '@smartspend/transactions',
  darkMode: '@smartspend/dark-mode',
} as const;

function isTransactionType(value: unknown): value is TransactionType {
  return value === 'income' || value === 'expense';
}

function sanitizeTransaction(value: unknown): Transaction | null {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as Partial<Transaction>;
  const date = new Date(candidate.date ?? '');
  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.title !== 'string' ||
    typeof candidate.amount !== 'number' ||
    !Number.isFinite(candidate.amount) ||
    candidate.amount <= 0 ||
    !isTransactionType(candidate.type) ||
    typeof candidate.category !== 'string' ||
    candidate.category.length === 0 ||
    Number.isNaN(date.getTime())
  ) {
    return null;
  }

  return {
    id: candidate.id,
    title: candidate.title.trim() || 'Giao dịch',
    amount: candidate.amount,
    type: candidate.type,
    category: candidate.category,
    note: typeof candidate.note === 'string' ? candidate.note : undefined,
    date: date.toISOString(),
  };
}

export async function loadTransactions(): Promise<Transaction[] | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.transactions);
  if (raw === null) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeTransaction).filter((item): item is Transaction => item !== null);
  } catch {
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
}

export async function loadDarkMode(): Promise<boolean | null> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.darkMode);
  if (value === null) return null;
  return value === 'true';
}

export async function saveDarkMode(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.darkMode, String(enabled));
}

export async function clearAppData(): Promise<void> {
  await AsyncStorage.multiRemove([STORAGE_KEYS.transactions, STORAGE_KEYS.darkMode]);
  await saveTransactions([]);
}
