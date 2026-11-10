import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import type { IconName } from '../../components/ui/iconTypes';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { typography } from '../../core/theme/typography';
import { formatDuration } from '../../utils/format';
import type { ReplyPreview } from './types';
import { VoiceWaveform } from './VoiceWaveform';

type Props = {
  onSendText: (text: string) => void;
  onAttach: (anchorY: number) => void;
  recording: boolean;
  elapsedMs: number;
  level?: number;
  onStartRecording: () => void;
  onCancelRecording: () => void;
  onSendRecording: () => void;
  replyPreview: ReplyPreview | null;
  onCancelReply: () => void;
};

type ActionButtonProps = {
  icon: IconName;
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  filled?: boolean;
};

function ActionButton({ icon, label, onPress, filled = false }: ActionButtonProps) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        filled
          ? { backgroundColor: colors.accent }
          : {
              backgroundColor: pressed ? colors.surfaceContainerHigh : colors.surfaceContainer,
              borderColor: colors.cardBorder,
              borderWidth: 1,
            },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={20} color={filled ? colors.onAccent : colors.textPrimary} />
    </Pressable>
  );
}

export function MessageComposer({
  onSendText,
  onAttach,
  recording,
  elapsedMs,
  level = 0,
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

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: keyboardOpen ? spacing.sm : Math.max(insets.bottom, 12),
        },
      ]}
    >
      {replyPreview && !recording ? (
        <View
          style={[
            styles.replyBar,
            {
              backgroundColor: colors.surfaceContainer,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={[styles.replyAccent, { backgroundColor: colors.accent }]} />
          <View style={styles.replyText}>
            <AppText variant="captionSmall" style={[styles.replyAuthor, { color: colors.accent }]}>
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
            style={styles.cancelReplyBtn}
          >
            <Ionicons name="close" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      ) : null}

      {recording ? (
        <View style={styles.row}>
          <ActionButton icon="trash-outline" label="Cancel recording" onPress={onCancelRecording} />
          <View
            style={[
              styles.inputBox,
              styles.recordingPill,
              {
                backgroundColor: colors.surfaceContainer,
                borderColor: colors.destructive,
              },
            ]}
          >
            <View style={[styles.recordingDot, { backgroundColor: colors.destructive }]} />
            <AppText variant="subhead" style={{ color: colors.textPrimary }}>
              {formatDuration(elapsedMs)}
            </AppText>
            <VoiceWaveform level={level} color={colors.accent} />
          </View>
          <ActionButton icon="arrow-up" label="Send voice message" onPress={onSendRecording} filled />
        </View>
      ) : (
        <View style={styles.row}>
          <ActionButton
            icon="add"
            label="Attach file or media"
            onPress={(event) => onAttach(event.nativeEvent.pageY - event.nativeEvent.locationY)}
          />
          <View
            style={[
              styles.inputBox,
              {
                backgroundColor: colors.surfaceContainer,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder="Write a message..."
              placeholderTextColor={colors.textMuted}
              accessibilityLabel="Message"
              multiline
              style={[styles.input, typography.callout, { color: colors.textPrimary }]}
            />
            {canSend ? (
              <Animated.View
                entering={ZoomIn.duration(150)}
                exiting={ZoomOut.duration(100)}
                style={styles.innerBtnBox}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Send"
                  hitSlop={8}
                  onPress={send}
                  style={[styles.sendBtn, { backgroundColor: colors.accent }]}
                >
                  <Ionicons name="arrow-up" size={18} color={colors.onAccent} />
                </Pressable>
              </Animated.View>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Record voice message"
                hitSlop={8}
                onPress={onStartRecording}
                style={[styles.innerBtnBox, styles.micBtn]}
              >
                <Ionicons name="mic-outline" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  replyAccent: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: radius.pill,
  },
  replyText: {
    flex: 1,
    gap: 1,
  },
  replyAuthor: {
    fontWeight: '700',
  },
  cancelReplyBtn: {
    padding: 4,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 40,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  recordingPill: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 40,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 120,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 8,
    textAlignVertical: 'center',
    fontSize: 14.5,
  },
  innerBtnBox: {
    margin: 3,
  },
  micBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
