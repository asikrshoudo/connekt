import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { radius } from '../../core/theme/radius';
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
      style={({ pressed }) => [
        styles.row,
        pressed && { backgroundColor: colors.surfaceContainerHigh },
      ]}
    >
      <Avatar name={name} size={46} />
      <View style={[styles.body, { borderBottomColor: colors.border }]}>
        <View style={styles.text}>
          <AppText
            variant="headline"
            numberOfLines={1}
            style={[
              styles.name,
              call.missed ? { color: colors.destructive } : undefined,
            ]}
          >
            {name}
          </AppText>
          <View style={styles.meta}>
            <View
              style={[
                styles.iconTag,
                {
                  backgroundColor: call.missed
                    ? `${colors.destructive}14`
                    : colors.surfaceContainer,
                },
              ]}
            >
              <Ionicons
                name={call.kind === 'video' ? 'videocam' : 'call'}
                size={12}
                color={accent}
              />
            </View>
            <AppText variant="captionSmall" tone="secondary">
              {status} · {call.kind === 'video' ? 'Video huddle' : 'Voice call'}
            </AppText>
          </View>
        </View>
        <AppText variant="captionSmall" tone="muted">
          {time}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    minHeight: 68,
  },
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
  text: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconTag: {
    padding: 3,
    borderRadius: radius.xs,
  },
});
