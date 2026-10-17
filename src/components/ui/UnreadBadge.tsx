import { StyleSheet, View } from 'react-native';
import { radius } from '../../core/theme/radius';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from './AppText';

export function UnreadBadge({ count }: { count: number }) {
  const colors = useColors();
  return (
    <View style={[styles.badge, { backgroundColor: colors.unread }]}>
      <AppText variant="caption" style={[styles.text, { color: colors.onAccent }]}>
        {count > 99 ? '99+' : String(count)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontWeight: '600' },
});
