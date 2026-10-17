import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { typography } from '../../core/theme/typography';
import type { ReplyPreview } from './types';

type Props = {
  onSend: (text: string) => void;
  replyPreview: ReplyPreview | null;
  onCancelReply: () => void;
};

export function MessageComposer({ onSend, replyPreview, onCancelReply }: Props) {
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
    onSend(text.trim());
    setText('');
  };

  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: keyboardOpen ? spacing.sm : insets.bottom + spacing.sm },
      ]}
    >
      {replyPreview ? (
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
      <View
        style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.inputBorder }]}
      >
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
            style={styles.sendWrap}
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
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 10,
    textAlignVertical: 'center',
  },
  sendWrap: { margin: 5 },
  send: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
