import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from '../ui/AppText';
import { popIn } from './popKeyframe';

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// A small card in the middle of the screen with two choices.
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.scrim }]}>
        <Pressable accessibilityLabel="Close" onPress={onCancel} style={StyleSheet.absoluteFill} />
        <Animated.View
          entering={popIn}
          style={[styles.card, { backgroundColor: colors.surfaceElevated }]}
        >
          <View style={styles.text}>
            <AppText variant="headline" style={styles.center}>
              {title}
            </AppText>
            {message ? (
              <AppText variant="callout" tone="secondary" style={styles.center}>
                {message}
              </AppText>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
            onPress={onConfirm}
            style={({ pressed }) => [
              styles.button,
              { borderTopColor: colors.border },
              pressed && { backgroundColor: colors.surface },
            ]}
          >
            <AppText
              variant="headline"
              style={{ color: destructive ? colors.destructive : colors.accent }}
            >
              {confirmLabel}
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            onPress={onCancel}
            style={({ pressed }) => [
              styles.button,
              { borderTopColor: colors.border },
              pressed && { backgroundColor: colors.surface },
            ]}
          >
            <AppText variant="headline" style={{ color: colors.accent }}>
              {cancelLabel}
            </AppText>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  card: { width: '100%', maxWidth: 320, borderRadius: 20, overflow: 'hidden' },
  text: { padding: spacing.xl, gap: spacing.sm },
  center: { textAlign: 'center' },
  button: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
