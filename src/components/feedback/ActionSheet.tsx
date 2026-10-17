import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { duration } from '../../core/theme/motion';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from '../ui/AppText';

export type SheetAction = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  actions: SheetAction[];
  cancelLabel?: string;
  onClose: () => void;
};

export function ActionSheet({
  visible,
  title,
  message,
  actions,
  cancelLabel = 'Cancel',
  onClose,
}: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityLabel="Close"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
        />
        <Animated.View
          entering={SlideInDown.duration(duration.base)}
          style={[
            styles.sheet,
            { backgroundColor: colors.surfaceElevated, paddingBottom: insets.bottom + spacing.md },
          ]}
        >
          {title || message ? (
            <View style={styles.header}>
              {title ? (
                <AppText variant="headline" style={styles.center}>
                  {title}
                </AppText>
              ) : null}
              {message ? (
                <AppText variant="footnote" tone="secondary" style={styles.center}>
                  {message}
                </AppText>
              ) : null}
            </View>
          ) : null}
          {actions.map((action) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              onPress={action.onPress}
              style={({ pressed }) => [
                styles.action,
                { borderTopColor: colors.border },
                pressed && { backgroundColor: colors.surface },
              ]}
            >
              <AppText
                variant="headline"
                style={{ color: action.destructive ? colors.destructive : colors.accent }}
              >
                {action.label}
              </AppText>
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={[styles.cancel, { backgroundColor: colors.surface }]}
          >
            <AppText variant="headline">{cancelLabel}</AppText>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  header: { paddingVertical: spacing.md, gap: spacing.xs },
  center: { textAlign: 'center' },
  action: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cancel: {
    marginTop: spacing.md,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
