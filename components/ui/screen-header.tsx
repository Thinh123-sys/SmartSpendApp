import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useTheme } from '@/hooks/use-theme';

type ScreenHeaderProps = {
  eyebrow?: string;
  title: string;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
};

export function ScreenHeader({ eyebrow, title, actionIcon, actionLabel, onAction }: ScreenHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        {eyebrow ? (
          <AppText variant="caption" color={colors.textSecondary} style={styles.eyebrow}>
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="title">{title}</AppText>
      </View>
      {actionIcon && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={({ pressed }) => [
            styles.action,
            { backgroundColor: colors.primarySoft, opacity: pressed ? 0.7 : 1 },
          ]}>
          <Ionicons name={actionIcon} size={23} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  copy: {
    flex: 1,
  },
  eyebrow: {
    marginBottom: 2,
  },
  action: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
