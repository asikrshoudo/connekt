import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar, type PresenceStatus } from '../../components/ui/Avatar';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = {
  name: string;
  onBack: () => void;
  onProfile?: () => void;
  group?: boolean;
  subtitle?: string;
  presence?: PresenceStatus | null;
};

export function ConversationHeader({
  name,
  onBack,
  onProfile,
  group = false,
  subtitle,
  presence,
}: Props) {
  const colors = useColors();

  const identity = (
    <>
      <Avatar name={name} size={38} group={group} presence={presence} />
      <View style={styles.text}>
        <View style={styles.titleRow}>
          {group ? (
            <Ionicons name="people" size={13} color={colors.accent} style={styles.groupIcon} />
          ) : null}
          <AppText variant="headline" numberOfLines={1} style={styles.name}>
            {name}
          </AppText>
        </View>
        <AppText variant="captionSmall" style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle || (group ? 'Team Channel' : presence === 'online' ? 'Active now' : 'Direct Message')}
        </AppText>
      </View>
    </>
  );

  return (
    <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [
          styles.back,
          {
            backgroundColor: pressed ? colors.surfaceContainerHigh : colors.surfaceContainer,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
      </Pressable>

      {onProfile ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${name}, view info`}
          onPress={onProfile}
          style={styles.identity}
        >
          {identity}
        </Pressable>
      ) : (
        <View style={styles.identity}>{identity}</View>
      )}

      {onProfile ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Details"
          onPress={onProfile}
          style={({ pressed }) => [
            styles.infoButton,
            {
              backgroundColor: pressed ? colors.surfaceContainerHigh : colors.surfaceContainer,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    minHeight: 60,
    gap: spacing.sm,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  text: {
    flex: 1,
    gap: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  groupIcon: {
    marginRight: 2,
  },
  name: {
    fontWeight: '700',
    fontSize: 15,
  },
  subtitle: {
    letterSpacing: 0.2,
  },
  infoButton: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
