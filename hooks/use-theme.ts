import { useApp } from '@/hooks/use-app';

export function useTheme() {
  const { colors, darkMode, setDarkMode } = useApp();
  return { colors, darkMode, setDarkMode };
}
