import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { AppProvider } from '@/contexts/app-context';
import { useTheme } from '@/hooks/use-theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { colors, darkMode } = useTheme();
  const baseTheme = darkMode ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.expense,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="transaction/add" options={{ title: 'Thêm giao dịch', presentation: 'modal' }} />
        <Stack.Screen name="transaction/[id]" options={{ title: 'Chi tiết giao dịch' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'SmartSpend' }} />
      </Stack>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
