import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { PillButton } from '../ui/PillButton';
import { AppText } from '../ui/AppText';
import type { IconName } from '../ui/iconTypes';

type Props = {
  title: string;
  message: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, icon, actionLabel, onAction }: Props) {
  const colors = useColors();

  return (
    <View style={styles.root}>
      {icon ? (
        <View style={[styles.iconBox, { backgroundColor: colors.surfaceContainerHigh }]}>
          <Ionicons name={icon} size={28} color={colors.accent} />
        </View>
      ) : null}
      <AppText variant="headline" style={styles.title}>
        {title}
      </AppText>
      <AppText tone="secondary" style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <PillButton
          label={actionLabel}
          onPress={onAction}
          variant="tonal"
          size="medium"
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
    gap: spacing.xs,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  action: {
    marginTop: spacing.md,
  },
});
