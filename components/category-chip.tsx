import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import type { Category } from '@/constants/categories';
import { useTheme } from '@/hooks/use-theme';

type CategoryChipProps = {
  category: Category;
  selected: boolean;
  onPress: () => void;
  compact?: boolean;
};

export function CategoryChip({ category, selected, onPress, compact = false }: CategoryChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        compact && styles.compact,
        {
          backgroundColor: selected ? colors.primarySoft : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.72 : 1,
        },
      ]}>
      <Ionicons name={category.icon} size={compact ? 16 : 18} color={selected ? colors.primary : category.color} />
      <AppText variant={compact ? 'caption' : 'label'} color={selected ? colors.primary : colors.textSecondary}>
        {category.label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 43,
    paddingHorizontal: 13,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compact: {
    minHeight: 36,
    paddingHorizontal: 11,
    borderRadius: 12,
  },
});
