import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from '../ui/AppText';
import { popIn } from './popKeyframe';

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

// A small card in the middle of the screen with a list of choices.
// The name stays ActionSheet so every existing confirmation uses it.
export function ActionSheet({
  visible,
  title,
  message,
  actions,
  cancelLabel = 'Cancel',
  onClose,
}: Props) {
  const colors = useColors();
  const hasHeader = Boolean(title || message);

  const row =
    (withBorder: boolean) =>
    ({ pressed }: { pressed: boolean }) => [
      styles.row,
      withBorder && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
      pressed && { backgroundColor: colors.surface },
    ];

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
          entering={popIn}
          style={[styles.card, { backgroundColor: colors.surfaceElevated }]}
        >
          {hasHeader ? (
            <View style={styles.text}>
              {title ? (
                <AppText variant="headline" style={styles.center}>
                  {title}
                </AppText>
              ) : null}
              {message ? (
                <AppText variant="callout" tone="secondary" style={styles.center}>
                  {message}
                </AppText>
              ) : null}
            </View>
          ) : null}
          {actions.map((action, index) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={action.onPress}
              style={row(hasHeader || index > 0)}
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
            accessibilityLabel={cancelLabel}
            onPress={onClose}
            style={row(hasHeader || actions.length > 0)}
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
  row: { height: 52, alignItems: 'center', justifyContent: 'center' },
});
