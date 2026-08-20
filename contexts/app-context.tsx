import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { palettes, type ColorPalette } from '@/constants/colors';
import { createSampleTransactions } from '@/constants/sample-data';
import {
  clearAppData,
  loadDarkMode,
  loadTransactions,
  saveDarkMode,
  saveTransactions,
} from '@/services/storage';
import type { Transaction, TransactionInput } from '@/types/transaction';

type AppContextValue = {
  transactions: Transaction[];
  isReady: boolean;
  darkMode: boolean;
  colors: ColorPalette;
  addTransaction: (input: TransactionInput) => Promise<Transaction>;
  updateTransaction: (id: string, input: TransactionInput) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  getTransaction: (id: string) => Transaction | undefined;
  setDarkMode: (enabled: boolean) => Promise<void>;
  resetAllData: () => Promise<void>;
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AppProvider({ children }: PropsWithChildren) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [darkMode, setDarkModeState] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const transactionsRef = useRef<Transaction[]>([]);

  const applyTransactions = useCallback((next: Transaction[]) => {
    transactionsRef.current = next;
    setTransactions(next);
  }, []);

  useEffect(() => {
    async function hydrate() {
      try {
        const [storedTransactions, storedDarkMode] = await Promise.all([
          loadTransactions(),
          loadDarkMode(),
        ]);
        const initialTransactions = storedTransactions ?? createSampleTransactions();
        applyTransactions(initialTransactions);
        setDarkModeState(storedDarkMode ?? false);

        if (storedTransactions === null) {
          await saveTransactions(initialTransactions);
        }
      } catch (error) {
        console.warn('Không thể đọc dữ liệu SmartSpend:', error);
        applyTransactions(createSampleTransactions());
      } finally {
        setIsReady(true);
      }
    }

    void hydrate();
  }, [applyTransactions]);

  const commitTransactions = useCallback(
    async (next: Transaction[]) => {
      const previous = transactionsRef.current;
      applyTransactions(next);
      try {
        await saveTransactions(next);
      } catch (error) {
        applyTransactions(previous);
        throw error;
      }
    },
    [applyTransactions]
  );

  const addTransaction = useCallback(
    async (input: TransactionInput) => {
      const transaction: Transaction = { ...input, id: createId() };
      await commitTransactions([transaction, ...transactionsRef.current]);
      return transaction;
    },
    [commitTransactions]
  );

  const updateTransaction = useCallback(
    async (id: string, input: TransactionInput) => {
      const exists = transactionsRef.current.some((transaction) => transaction.id === id);
      if (!exists) return false;

      const next = transactionsRef.current.map((transaction) =>
        transaction.id === id ? { ...input, id } : transaction
      );
      await commitTransactions(next);
      return true;
    },
    [commitTransactions]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const next = transactionsRef.current.filter((transaction) => transaction.id !== id);
      if (next.length === transactionsRef.current.length) return false;
      await commitTransactions(next);
      return true;
    },
    [commitTransactions]
  );

  const getTransaction = useCallback(
    (id: string) => transactions.find((transaction) => transaction.id === id),
    [transactions]
  );

  const setDarkMode = useCallback(async (enabled: boolean) => {
    const previous = darkMode;
    setDarkModeState(enabled);
    try {
      await saveDarkMode(enabled);
    } catch (error) {
      setDarkModeState(previous);
      throw error;
    }
  }, [darkMode]);

  const resetAllData = useCallback(async () => {
    await clearAppData();
    applyTransactions([]);
    setDarkModeState(false);
  }, [applyTransactions]);

  const value = useMemo<AppContextValue>(
    () => ({
      transactions,
      isReady,
      darkMode,
      colors: darkMode ? palettes.dark : palettes.light,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getTransaction,
      setDarkMode,
      resetAllData,
    }),
    [
      transactions,
      isReady,
      darkMode,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getTransaction,
      setDarkMode,
      resetAllData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
