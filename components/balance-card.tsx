import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency } from '@/utils/currency';

type BalanceCardProps = {
  balance: number;
  income: number;
  expense: number;
};

export function BalanceCard({ balance, income, expense }: BalanceCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.primary }]}>
      <View style={styles.decorOne} />
      <View style={styles.decorTwo} />
      <AppText variant="label" color="rgba(255,255,255,0.76)">
        Số dư hiện tại
      </AppText>
      <AppText variant="display" color={colors.white} style={styles.balance} numberOfLines={1} adjustsFontSizeToFit>
        {formatCurrency(balance)}
      </AppText>

      <View style={styles.divider} />
      <View style={styles.summaryRow}>
        <SummaryItem icon="arrow-down" label="Thu nhập" value={income} />
        <View style={styles.verticalDivider} />
        <SummaryItem icon="arrow-up" label="Chi tiêu" value={expense} />
      </View>
    </View>
  );
}

function SummaryItem({ icon, label, value }: { icon: 'arrow-down' | 'arrow-up'; label: string; value: number }) {
  return (
    <View style={styles.summaryItem}>
      <View style={styles.summaryTitle}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={14} color="#FFFFFF" />
        </View>
        <AppText variant="caption" color="rgba(255,255,255,0.72)">
          {label}
        </AppText>
      </View>
      <AppText variant="label" color="#FFFFFF" numberOfLines={1} adjustsFontSizeToFit>
        {formatCurrency(value)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: 22,
    overflow: 'hidden',
    shadowColor: '#0C4837',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 7,
  },
  decorOne: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    right: -65,
    top: -90,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorTwo: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    right: 25,
    bottom: -90,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  balance: {
    marginTop: 7,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.24)',
    marginVertical: 19,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    gap: 7,
  },
  summaryTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  iconCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalDivider: {
    width: StyleSheet.hairlineWidth,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.22)',
    marginHorizontal: 18,
  },
});
