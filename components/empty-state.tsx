import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function EmptyState({ title, description, actionLabel, onAction, icon = 'receipt-outline' }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={30} color={colors.primary} />
      </View>
      <AppText variant="subtitle" style={styles.title}>{title}</AppText>
      <AppText color={colors.textSecondary} style={styles.description}>{description}</AppText>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [styles.action, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}>
          <Ionicons name="add" size={18} color={colors.white} />
          <AppText variant="label" color={colors.white}>{actionLabel}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 44,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginTop: 7,
    maxWidth: 290,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 17,
    minHeight: 44,
    borderRadius: 14,
    marginTop: 18,
  },
});
