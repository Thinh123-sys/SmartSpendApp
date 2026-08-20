import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type AppTextVariant = 'body' | 'caption' | 'label' | 'subtitle' | 'title' | 'display';

type AppTextProps = PropsWithChildren<TextProps> & {
  variant?: AppTextVariant;
  color?: string;
};

export function AppText({ variant = 'body', color, style, children, ...props }: AppTextProps) {
  const { colors } = useTheme();

  return (
    <Text {...props} style={[styles.base, styles[variant], { color: color ?? colors.text }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: undefined,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  display: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
});
