import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from '../ui/AppText';
import type { IconName } from '../ui/iconTypes';

export const MENU_ROW_HEIGHT = 48;
export const MENU_WIDTH = 220;

export type MenuItem = {
  label: string;
  icon: IconName;
  onPress: () => void;
  destructive?: boolean;
};

export function MenuCard({ items }: { items: MenuItem[] }) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
      {items.map((item, index) => {
        const color = item.destructive ? colors.destructive : colors.textPrimary;
        return (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.row,
              index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
              pressed && { backgroundColor: colors.surface },
            ]}
          >
            <AppText style={{ color }}>{item.label}</AppText>
            <Ionicons name={item.icon} size={20} color={color} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: MENU_WIDTH,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  row: {
    height: MENU_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
});
