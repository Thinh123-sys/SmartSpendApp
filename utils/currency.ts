export function formatCurrency(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${Math.round(safeAmount).toLocaleString('vi-VN')} ₫`;
}

export function formatSignedCurrency(amount: number, type: 'income' | 'expense'): string {
  return `${type === 'income' ? '+' : '-'} ${formatCurrency(Math.abs(amount))}`;
}

export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
}
