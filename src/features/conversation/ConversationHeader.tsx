import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = {
  name: string;
  onBack: () => void;
  onProfile?: () => void;
  group?: boolean;
  subtitle?: string;
};

export function ConversationHeader({ name, onBack, onProfile, group = false, subtitle }: Props) {
  const colors = useColors();

  const identity = (
    <>
      <Avatar name={name} size={36} group={group} />
      <View style={styles.text}>
        <AppText variant="headline" numberOfLines={1}>
          {name}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </>
  );

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        hitSlop={8}
        style={styles.back}
      >
        <Ionicons name="chevron-back" size={28} color={colors.accent} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  identity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  text: { flex: 1 },
});
