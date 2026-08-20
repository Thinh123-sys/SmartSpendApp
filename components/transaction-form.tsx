import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryChip } from '@/components/category-chip';
import { AppText } from '@/components/ui/app-text';
import { getCategoriesByType } from '@/constants/categories';
import { useTheme } from '@/hooks/use-theme';
import type { TransactionInput, TransactionType } from '@/types/transaction';
import { formatCurrency, parseCurrencyInput } from '@/utils/currency';
import { parseDateInput, toDateInput } from '@/utils/date';

type TransactionFormProps = {
  initialValue?: TransactionInput;
  submitLabel: string;
  onSubmit: (input: TransactionInput) => Promise<void>;
  onCancel?: () => void;
};

type FormErrors = Partial<Record<'title' | 'amount' | 'category' | 'date', string>>;

export function TransactionForm({ initialValue, submitLabel, onSubmit, onCancel }: TransactionFormProps) {
  const { colors } = useTheme();
  const [type, setType] = useState<TransactionType>(initialValue?.type ?? 'expense');
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [amountText, setAmountText] = useState(initialValue ? String(initialValue.amount) : '');
  const [category, setCategory] = useState(initialValue?.category ?? '');
  const [dateText, setDateText] = useState(toDateInput(initialValue?.date));
  const [note, setNote] = useState(initialValue?.note ?? '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const categories = useMemo(() => getCategoriesByType(type), [type]);
  const amount = parseCurrencyInput(amountText);

  function selectType(nextType: TransactionType) {
    setType(nextType);
    if (!getCategoriesByType(nextType).some((item) => item.id === category)) {
      setCategory('');
    }
    setErrors((current) => ({ ...current, category: undefined }));
  }

  function validate(): { input: TransactionInput | null; errors: FormErrors } {
    const nextErrors: FormErrors = {};
    const parsedDate = parseDateInput(dateText);

    if (!title.trim()) nextErrors.title = 'Vui lòng nhập tên giao dịch.';
    if (amount <= 0) nextErrors.amount = 'Số tiền phải lớn hơn 0.';
    if (!categories.some((item) => item.id === category)) {
      nextErrors.category = 'Vui lòng chọn danh mục.';
    }
    if (!parsedDate) nextErrors.date = 'Ngày phải có định dạng YYYY-MM-DD và hợp lệ.';

    if (Object.keys(nextErrors).length > 0 || !parsedDate) {
      return { input: null, errors: nextErrors };
    }

    return {
      errors: {},
      input: {
        title: title.trim(),
        amount,
        type,
        category,
        date: parsedDate,
        note: note.trim() || undefined,
      },
    };
  }

  async function handleSubmit() {
    const result = validate();
    setErrors(result.errors);
    if (!result.input) return;

    setIsSaving(true);
    try {
      await onSubmit(result.input);
    } catch {
      Alert.alert('Không thể lưu', 'Đã có lỗi khi lưu dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[styles.typeSelector, { backgroundColor: colors.surfaceMuted }]}>
            <TypeButton
              label="Chi tiêu"
              icon="arrow-up-outline"
              selected={type === 'expense'}
              selectedColor={colors.expense}
              selectedBackground={colors.expenseSoft}
              onPress={() => selectType('expense')}
            />
            <TypeButton
              label="Thu nhập"
              icon="arrow-down-outline"
              selected={type === 'income'}
              selectedColor={colors.income}
              selectedBackground={colors.incomeSoft}
              onPress={() => selectType('income')}
            />
          </View>

          <View style={styles.amountSection}>
            <AppText variant="caption" color={colors.textSecondary}>SỐ TIỀN</AppText>
            <View style={styles.amountRow}>
              <TextInput
                accessibilityLabel="Số tiền"
                value={amountText}
                onChangeText={(value) => {
                  setAmountText(value.replace(/[^0-9]/g, ''));
                  setErrors((current) => ({ ...current, amount: undefined }));
                }}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                style={[styles.amountInput, { color: type === 'income' ? colors.income : colors.expense }]}
                maxLength={15}
              />
              <AppText variant="title" color={colors.textSecondary}>₫</AppText>
            </View>
            {amount > 0 ? (
              <AppText variant="caption" color={colors.textMuted}>{formatCurrency(amount)}</AppText>
            ) : null}
            <FieldError message={errors.amount} />
          </View>

          <FormField label="Tên giao dịch" error={errors.title}>
            <TextInput
              value={title}
              onChangeText={(value) => {
                setTitle(value);
                setErrors((current) => ({ ...current, title: undefined }));
              }}
              placeholder="Ví dụ: Bữa trưa"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.text, backgroundColor: colors.input, borderColor: errors.title ? colors.expense : colors.border }]}
              maxLength={60}
              returnKeyType="next"
            />
          </FormField>

          <FormField label="Danh mục" error={errors.category}>
            <View style={styles.categoryGrid}>
              {categories.map((item) => (
                <CategoryChip
                  key={item.id}
                  category={item}
                  selected={category === item.id}
                  onPress={() => {
                    setCategory(item.id);
                    setErrors((current) => ({ ...current, category: undefined }));
                  }}
                />
              ))}
            </View>
          </FormField>

          <FormField label="Ngày" error={errors.date} hint="Định dạng YYYY-MM-DD">
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} style={styles.dateIcon} />
              <TextInput
                value={dateText}
                onChangeText={(value) => {
                  setDateText(value);
                  setErrors((current) => ({ ...current, date: undefined }));
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  styles.dateInput,
                  { color: colors.text, backgroundColor: colors.input, borderColor: errors.date ? colors.expense : colors.border },
                ]}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
              />
              <Pressable
                onPress={() => {
                  setDateText(toDateInput());
                  setErrors((current) => ({ ...current, date: undefined }));
                }}
                style={({ pressed }) => [styles.todayButton, { backgroundColor: colors.primarySoft, opacity: pressed ? 0.7 : 1 }]}>
                <AppText variant="caption" color={colors.primary} style={styles.todayText}>Hôm nay</AppText>
              </Pressable>
            </View>
          </FormField>

          <FormField label="Ghi chú" hint="Không bắt buộc">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Thêm ghi chú..."
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.noteInput, { color: colors.text, backgroundColor: colors.input, borderColor: colors.border }]}
              multiline
              maxLength={200}
              textAlignVertical="top"
            />
          </FormField>

          <View style={styles.actions}>
            {onCancel ? (
              <Pressable
                disabled={isSaving}
                onPress={onCancel}
                style={({ pressed }) => [styles.secondaryButton, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}>
                <AppText variant="label">Hủy</AppText>
              </Pressable>
            ) : null}
            <Pressable
              disabled={isSaving}
              onPress={() => void handleSubmit()}
              style={({ pressed }) => [
                styles.submitButton,
                { backgroundColor: colors.primary, opacity: isSaving || pressed ? 0.72 : 1 },
              ]}>
              {isSaving ? <ActivityIndicator color={colors.white} /> : <Ionicons name="checkmark" size={20} color={colors.white} />}
              <AppText variant="label" color={colors.white}>{isSaving ? 'Đang lưu...' : submitLabel}</AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TypeButton({
  label,
  icon,
  selected,
  selectedColor,
  selectedBackground,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  selectedColor: string;
  selectedBackground: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.typeButton,
        { backgroundColor: selected ? selectedBackground : 'transparent', opacity: pressed ? 0.7 : 1 },
      ]}>
      <Ionicons name={icon} size={18} color={selected ? selectedColor : colors.textMuted} />
      <AppText variant="label" color={selected ? selectedColor : colors.textSecondary}>{label}</AppText>
    </Pressable>
  );
}

function FormField({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeader}>
        <AppText variant="label">{label}</AppText>
        {hint ? <AppText variant="caption" color={colors.textMuted}>{hint}</AppText> : null}
      </View>
      {children}
      <FieldError message={error} />
    </View>
  );
}

function FieldError({ message }: { message?: string }) {
  const { colors } = useTheme();
  return message ? <AppText variant="caption" color={colors.expense} style={styles.error}>{message}</AppText> : null;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 44,
    gap: 22,
  },
  typeSelector: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 17,
    gap: 5,
  },
  typeButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  amountSection: {
    alignItems: 'center',
    minHeight: 112,
    justifyContent: 'center',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  amountInput: {
    minWidth: 70,
    maxWidth: '82%',
    fontSize: 37,
    lineHeight: 45,
    fontWeight: '800',
    textAlign: 'right',
    padding: 0,
  },
  field: { gap: 9 },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  input: {
    minHeight: 52,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  dateInput: {
    flex: 1,
    paddingLeft: 45,
    paddingRight: 82,
  },
  todayButton: {
    position: 'absolute',
    right: 7,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 11,
  },
  todayText: { fontWeight: '700' },
  noteInput: {
    minHeight: 105,
    paddingTop: 14,
  },
  error: { marginTop: -2 },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  secondaryButton: {
    minHeight: 54,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
