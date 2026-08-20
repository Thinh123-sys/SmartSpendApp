export type ColorPalette = {
  background: string;
  surface: string;
  surfaceMuted: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primarySoft: string;
  income: string;
  incomeSoft: string;
  expense: string;
  expenseSoft: string;
  border: string;
  input: string;
  overlay: string;
  white: string;
};

export const palettes: Record<'light' | 'dark', ColorPalette> = {
  light: {
    background: '#F5F7F6',
    surface: '#FFFFFF',
    surfaceMuted: '#EEF2F0',
    card: '#FFFFFF',
    text: '#17211D',
    textSecondary: '#56625D',
    textMuted: '#87918D',
    primary: '#127A5B',
    primarySoft: '#E2F3EC',
    income: '#16865F',
    incomeSoft: '#E4F5ED',
    expense: '#D34E4E',
    expenseSoft: '#FBEAEA',
    border: '#E2E8E5',
    input: '#F8FAF9',
    overlay: 'rgba(12, 22, 18, 0.45)',
    white: '#FFFFFF',
  },
  dark: {
    background: '#0F1512',
    surface: '#17201C',
    surfaceMuted: '#202B26',
    card: '#19231F',
    text: '#F2F6F4',
    textSecondary: '#B2BDB8',
    textMuted: '#7D8B85',
    primary: '#5ED0A6',
    primarySoft: '#193C30',
    income: '#63D6AD',
    incomeSoft: '#183A2F',
    expense: '#FF8A8A',
    expenseSoft: '#432526',
    border: '#2A3731',
    input: '#131B17',
    overlay: 'rgba(0, 0, 0, 0.62)',
    white: '#FFFFFF',
  },
};

export const categoryColors = [
  '#EF8354',
  '#4F86C6',
  '#9B5DE5',
  '#F15BB5',
  '#F5B700',
  '#00A6A6',
  '#2A9D8F',
  '#718096',
] as const;
