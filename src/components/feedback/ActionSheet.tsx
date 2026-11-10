import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const hasHeader = Boolean(title || message);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.scrim }]}>
        <Pressable accessibilityLabel="Close" onPress={onClose} style={StyleSheet.absoluteFill} />
        <Animated.View
          entering={SlideInDown.springify().damping(22)}
          exiting={SlideOutDown.duration(200)}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.outline }]} />
          </View>

          {hasHeader ? (
            <View style={styles.header}>
              {title ? (
                <AppText variant="headline" style={styles.title}>
                  {title}
                </AppText>
              ) : null}
              {message ? (
                <AppText variant="callout" tone="secondary" style={styles.message}>
                  {message}
                </AppText>
              ) : null}
            </View>
          ) : null}

          <View style={styles.actionList}>
            {actions.map((action) => (
              <Pressable
                key={action.label}
                accessibilityRole="button"
                accessibilityLabel={action.label}
                onPress={action.onPress}
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    backgroundColor: action.destructive
                      ? `${colors.destructive}12`
                      : pressed
                      ? colors.surfaceContainerHigh
                      : colors.surfaceContainer,
                  },
                ]}
              >
                <AppText
                  variant="headline"
                  style={{
                    color: action.destructive ? colors.destructive : colors.textPrimary,
                    fontWeight: '600',
                  }}
                >
                  {action.label}
                </AppText>
              </Pressable>
            ))}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                {
                  backgroundColor: pressed ? colors.surfaceContainerHigh : 'transparent',
                  borderColor: colors.border,
                },
              ]}
            >
              <AppText variant="headline" style={{ color: colors.textSecondary, fontWeight: '600' }}>
                {cancelLabel}
              </AppText>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderTopWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    opacity: 0.6,
  },
  header: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
  },
  message: {
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 18,
  },
  actionList: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  actionButton: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
});
