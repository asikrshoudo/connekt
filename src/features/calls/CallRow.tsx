import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import type { CallRecord } from '../../types/call';
import { formatChatTime } from '../../utils/formatChatTime';

type Props = {
  call: CallRecord;
  name: string;
  onPress: () => void;
};

const DIRECTION_LABEL = { incoming: 'Incoming', outgoing: 'Outgoing' } as const;

export function CallRow({ call, name, onPress }: Props) {
  const colors = useColors();
  const status = call.missed ? 'Missed' : DIRECTION_LABEL[call.direction];
  const kind = call.kind === 'video' ? 'video' : 'voice';
  const time = formatChatTime(call.at);
  const accent = call.missed ? colors.destructive : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${status} ${kind} call, ${time}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surface }]}
    >
      <Avatar name={name} size={44} />
      <View style={[styles.body, { borderBottomColor: colors.border }]}>
        <View style={styles.text}>
          <AppText
            variant="headline"
            numberOfLines={1}
            style={call.missed ? { color: colors.destructive } : undefined}
          >
            {name}
          </AppText>
          <View style={styles.meta}>
            <Ionicons
              name={call.kind === 'video' ? 'videocam-outline' : 'call-outline'}
              size={14}
              color={accent}
            />
            <AppText variant="footnote" tone="muted">
              {status}
            </AppText>
          </View>
        </View>
        <AppText variant="footnote" tone="muted">
          {time}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: { flex: 1, gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
