import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useTheme } from '@/hooks/use-theme';
import { useTransactions } from '@/hooks/use-transactions';

export default function SettingsScreen() {
  const { colors, darkMode, setDarkMode } = useTheme();
  const { transactions, resetAllData } = useTransactions();

  function handleThemeChange(enabled: boolean) {
    void setDarkMode(enabled).catch(() => {
      Alert.alert('Không thể lưu', 'Không thể lưu cài đặt giao diện lúc này.');
    });
  }

  function confirmReset() {
    Alert.alert(
      'Đặt lại toàn bộ dữ liệu?',
      'Tất cả giao dịch sẽ bị xóa khỏi điện thoại và không thể khôi phục.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa tất cả',
          style: 'destructive',
          onPress: () => {
            void resetAllData()
              .then(() => Alert.alert('Đã đặt lại', 'Toàn bộ dữ liệu SmartSpend đã được xóa.'))
              .catch(() => Alert.alert('Không thể đặt lại', 'Vui lòng thử lại sau.'));
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Cá nhân hóa ứng dụng" title="Cài đặt" />

        <SettingsSection title="Giao diện">
          <SettingsRow icon="moon-outline" title="Chế độ tối" description="Giảm độ sáng khi sử dụng ban đêm">
            <Switch
              value={darkMode}
              onValueChange={handleThemeChange}
              trackColor={{ false: colors.surfaceMuted, true: colors.primarySoft }}
              thumbColor={darkMode ? colors.primary : colors.textMuted}
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Tùy chọn">
          <SettingsRow icon="cash-outline" title="Đơn vị tiền tệ" description="Định dạng đang sử dụng">
            <View style={[styles.valueBadge, { backgroundColor: colors.primarySoft }]}>
              <AppText variant="label" color={colors.primary}>VND</AppText>
            </View>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Dữ liệu">
          <Pressable onPress={confirmReset} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}>
            <SettingsRow
              icon="trash-outline"
              iconColor={colors.expense}
              title="Xóa toàn bộ dữ liệu"
              titleColor={colors.expense}
              description={`${transactions.length} giao dịch đang được lưu`}>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </SettingsRow>
          </Pressable>
        </SettingsSection>

        <SettingsSection title="Thông tin">
          <SettingsRow icon="information-circle-outline" title="Về SmartSpend" description="Ứng dụng quản lý chi tiêu cá nhân">
            <AppText variant="caption" color={colors.textMuted}>v1.0.0</AppText>
          </SettingsRow>
        </SettingsSection>

        <View style={styles.footer}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Ionicons name="wallet" size={25} color={colors.white} />
          </View>
          <AppText variant="label">SmartSpend</AppText>
          <AppText variant="caption" color={colors.textMuted}>Kiểm soát tài chính, an tâm mỗi ngày.</AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>{title.toUpperCase()}</AppText>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>
    </View>
  );
}

function SettingsRow({
  icon,
  iconColor,
  title,
  titleColor,
  description,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  titleColor?: string;
  description: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: iconColor ? colors.expenseSoft : colors.primarySoft }]}>
        <Ionicons name={icon} size={20} color={iconColor ?? colors.primary} />
      </View>
      <View style={styles.rowCopy}>
        <AppText variant="label" color={titleColor}>{title}</AppText>
        <AppText variant="caption" color={colors.textSecondary}>{description}</AppText>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 110,
    gap: 22,
  },
  section: { gap: 8 },
  sectionTitle: { marginLeft: 4, fontWeight: '700', letterSpacing: 0.5 },
  sectionCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  row: {
    minHeight: 76,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: { flex: 1, gap: 2 },
  valueBadge: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 10 },
  footer: { alignItems: 'center', paddingVertical: 18, gap: 4 },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
});
