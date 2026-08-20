import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 7,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tổng quan',
          tabBarIcon: ({ color, focused }) => <Ionicons size={23} name={focused ? 'home' : 'home-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Giao dịch',
          tabBarIcon: ({ color, focused }) => <Ionicons size={23} name={focused ? 'receipt' : 'receipt-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Thống kê',
          tabBarIcon: ({ color, focused }) => <Ionicons size={23} name={focused ? 'pie-chart' : 'pie-chart-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color, focused }) => <Ionicons size={23} name={focused ? 'settings' : 'settings-outline'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
