export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Không rõ ngày';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function toDateInput(dateString?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  if (Number.isNaN(date.getTime())) return toDateInput();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateInput(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date.toISOString();
}

export function sortByNewest<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
