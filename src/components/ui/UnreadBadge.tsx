import { StyleSheet, View } from 'react-native';
import { radius } from '../../core/theme/radius';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from './AppText';

export function UnreadBadge({ count, muted = false }: { count: number; muted?: boolean }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: muted ? colors.surfaceContainerHighest : colors.unread,
          borderColor: muted ? colors.border : 'transparent',
          borderWidth: muted ? StyleSheet.hairlineWidth : 0,
        },
      ]}
    >
      <AppText
        variant="captionSmall"
        style={[styles.text, { color: muted ? colors.textSecondary : colors.onAccent }]}
      >
        {count > 99 ? '99+' : String(count)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    includeFontPadding: false,
  },
});
