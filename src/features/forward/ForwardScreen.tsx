import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useToast } from '../../components/feedback/ToastProvider';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { PillButton } from '../../components/ui/PillButton';
import { SearchField } from '../../components/ui/SearchField';
import type { RootStackParamList } from '../../core/navigation/types';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { isGroup } from '../../utils/conversation';
import { messagePreview } from '../../utils/messagePreview';
import { useChats } from '../chats/ChatsProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Forward'>;

const MAX_CHATS = 5;

export function ForwardScreen({ route, navigation }: Props) {
  const { conversationId, messageId } = route.params;
  const colors = useColors();
  const toast = useToast();
  const { items, getMessages, isBlocked, forwardMessage } = useChats();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const source = getMessages(conversationId).find((message) => message.id === messageId);

  if (!source) {
    return (
      <Screen>
        <ScreenHeader title="Forward" onBack={() => navigation.goBack()} />
        <EmptyState title="Message not found" message="This message is no longer available." />
      </Screen>
    );
  }

  const needle = query.trim().toLowerCase();
  const chats = items
    .map((item) => item.conversation)
    .filter((chat) => !isBlocked(chat.id) && chat.name.toLowerCase().includes(needle));

  const toggle = (id: string) =>
    setSelected((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      return current.length >= MAX_CHATS ? current : [...current, id];
    });

  const send = () => {
    if (selected.length === 0) return;
    const count = forwardMessage(source, selected);
    toast.show(count === 1 ? 'Forwarded' : `Forwarded to ${count} chats`);
    navigation.goBack();
  };

  return (
    <Screen>
      <ScreenHeader title="Forward" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <View style={[styles.preview, { backgroundColor: colors.surface }]}>
          <Ionicons name="arrow-redo-outline" size={20} color={colors.textMuted} />
          <AppText variant="callout" tone="secondary" numberOfLines={3} style={styles.previewText}>
            {messagePreview(source)}
          </AppText>
        </View>

        <SearchField value={query} onChangeText={setQuery} placeholder="Search chats" />
        <AppText variant="footnote" tone="muted" style={styles.hint}>
          {`Choose up to ${MAX_CHATS} chats (${selected.length} selected)`}
        </AppText>

        <FlatList
          style={styles.flex}
          data={chats}
          keyExtractor={(chat) => chat.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListEmptyComponent={<EmptyState title="No chats found" message="Try a different name." />}
          renderItem={({ item }) => {
            const checked = selected.includes(item.id);
            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={item.name}
                onPress={() => toggle(item.id)}
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surface }]}
              >
                <Avatar name={item.name} size={44} group={isGroup(item)} />
                <View style={[styles.body, { borderBottomColor: colors.border }]}>
                  <AppText variant="headline" numberOfLines={1} style={styles.name}>
                    {item.name}
                  </AppText>
                  <Ionicons
                    name={checked ? 'checkmark-circle' : 'ellipse-outline'}
                    size={26}
                    color={checked ? colors.accent : colors.textMuted}
                  />
                </View>
              </Pressable>
            );
          }}
        />

        <View style={styles.footer}>
          <PillButton
            size="large"
            label={selected.length > 0 ? `Send to ${selected.length}` : 'Choose chats'}
            onPress={send}
            disabled={selected.length === 0}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  previewText: { flex: 1 },
  hint: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: { flex: 1 },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});
