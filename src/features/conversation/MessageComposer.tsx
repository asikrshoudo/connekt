import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import type { IconName } from '../../components/ui/iconTypes';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { typography } from '../../core/theme/typography';
import { formatDuration } from '../../utils/format';
import type { ReplyPreview } from './types';

type Props = {
  onSendText: (text: string) => void;
  onAttach: () => void;
  recording: boolean;
  elapsedMs: number;
  onStartRecording: () => void;
  onCancelRecording: () => void;
  onSendRecording: () => void;
  replyPreview: ReplyPreview | null;
  onCancelReply: () => void;
};

type RoundButtonProps = { icon: IconName; label: string; onPress: () => void; filled?: boolean };

function RoundButton({ icon, label, onPress, filled = false }: RoundButtonProps) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.round,
        filled
          ? { backgroundColor: colors.bubbleOutgoing }
          : { backgroundColor: colors.surface, borderColor: colors.inputBorder, borderWidth: 1 },
      ]}
    >
      <Ionicons name={icon} size={24} color={filled ? colors.onAccent : colors.textPrimary} />
    </Pressable>
  );
}

export function MessageComposer({
  onSendText,
  onAttach,
  recording,
  elapsedMs,
  onStartRecording,
  onCancelRecording,
  onSendRecording,
  replyPreview,
  onCancelReply,
}: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [text, setText] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (replyPreview) inputRef.current?.focus();
  }, [replyPreview]);

  const canSend = text.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSendText(text.trim());
    setText('');
  };

  const pillStyle = [styles.pill, { backgroundColor: colors.surface, borderColor: colors.inputBorder }];

  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: keyboardOpen ? spacing.sm : insets.bottom + spacing.sm },
      ]}
    >
      {replyPreview && !recording ? (
        <View style={[styles.replyBar, { backgroundColor: colors.surface }]}>
          <View style={[styles.replyAccent, { backgroundColor: colors.accent }]} />
          <View style={styles.replyText}>
            <AppText variant="footnote" style={[styles.replyAuthor, { color: colors.accent }]}>
              {`Replying to ${replyPreview.author || 'message'}`}
            </AppText>
            <AppText variant="footnote" tone="secondary" numberOfLines={1}>
              {replyPreview.text}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel reply"
            hitSlop={10}
            onPress={onCancelReply}
          >
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      ) : null}

      {recording ? (
        <View style={styles.row}>
          <RoundButton icon="trash-outline" label="Cancel recording" onPress={onCancelRecording} />
          <View style={[...pillStyle, styles.recordingPill]}>
            <View style={[styles.dot, { backgroundColor: colors.destructive }]} />
            <AppText>{formatDuration(elapsedMs)}</AppText>
          </View>
          <RoundButton icon="arrow-up" label="Send voice message" onPress={onSendRecording} filled />
        </View>
      ) : (
        <View style={styles.row}>
          <RoundButton icon="add" label="Attach" onPress={onAttach} />
          <View style={pillStyle}>
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder="Message"
              placeholderTextColor={colors.textMuted}
              accessibilityLabel="Message"
              multiline
              style={[styles.input, typography.callout, { color: colors.textPrimary }]}
            />
            {canSend ? (
              <Animated.View
                entering={ZoomIn.duration(160)}
                exiting={ZoomOut.duration(120)}
                style={styles.innerButton}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Send"
                  hitSlop={8}
                  onPress={send}
                  style={[styles.send, { backgroundColor: colors.bubbleOutgoing }]}
                >
                  <Ionicons name="arrow-up" size={20} color={colors.onAccent} />
                </Pressable>
              </Animated.View>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Record voice message"
                hitSlop={8}
                onPress={onStartRecording}
                style={[styles.innerButton, styles.mic]}
              >
                <Ionicons name="mic-outline" size={22} color={colors.textPrimary} />
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  round: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
  },
  replyAccent: { width: 3, alignSelf: 'stretch', borderRadius: 2 },
  replyText: { flex: 1, gap: 1 },
  replyAuthor: { fontWeight: '600' },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 1,
  },
  recordingPill: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg },
  dot: { width: 10, height: 10, borderRadius: 5 },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 10,
    textAlignVertical: 'center',
  },
  innerButton: { margin: 5 },
  mic: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  send: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
