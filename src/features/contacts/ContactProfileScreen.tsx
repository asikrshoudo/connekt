import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import type { MediaItem } from '../../types/chat';
import { formatFileSize } from '../../utils/format';
import { useChats } from '../chats/ChatsProvider';
import { collectShared } from './sharedMedia';
import { SharedMediaGrid } from './SharedMediaGrid';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactProfile'>;

export function ContactProfileScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { getConversation, getMessages, isSample, isBlocked, block, unblock } = useChats();
  const [confirmBlock, setConfirmBlock] = useState(false);
  const conversation = getConversation(conversationId);
  const messages = getMessages(conversationId);
  const shared = useMemo(() => collectShared(messages), [messages]);

  if (!conversation) {
    return (
      <Screen>
        <ScreenHeader title="Contact info" onBack={() => navigation.goBack()} />
        <EmptyState title="Contact not found" message="This contact is no longer available." />
      </Screen>
    );
  }

  const blocked = isBlocked(conversation.id);

  const openMedia = (item: MediaItem) => {
    navigation.navigate('MediaViewer', { uri: item.uri, kind: item.kind });
  };

  return (
    <Screen>
      <ScreenHeader title="Contact info" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Avatar name={conversation.name} size={96} />
          <AppText variant="title">{conversation.name}</AppText>
          {isSample ? (
            <AppText variant="footnote" tone="muted">
              Sample contact
            </AppText>
          ) : null}
        </View>

        <View>
          <SectionHeader title={`Shared media (${shared.media.length})`} />
          {shared.media.length === 0 ? (
            <AppText tone="muted" style={styles.empty}>
              No photos or videos yet.
            </AppText>
          ) : (
            <SharedMediaGrid items={shared.media} onOpen={openMedia} />
          )}
        </View>

        <View>
          <SectionHeader title={`Files (${shared.files.length})`} />
          {shared.files.length === 0 ? (
            <AppText tone="muted" style={styles.empty}>
              No files yet.
            </AppText>
          ) : (
            <SettingsSection>
              {shared.files.map((message) =>
                message.attachment?.kind === 'file' ? (
                  <SettingsRow
                    key={message.id}
                    icon="document-outline"
                    label={message.attachment.name}
                    value={formatFileSize(message.attachment.size)}
                  />
                ) : null,
              )}
            </SettingsSection>
          )}
        </View>
        <SettingsSection footer="Blocking is saved on this device only for now.">
          <SettingsRow
            icon={blocked ? 'checkmark-circle-outline' : 'ban-outline'}
            label={blocked ? `Unblock ${conversation.name}` : `Block ${conversation.name}`}
            destructive={!blocked}
            onPress={() => (blocked ? unblock(conversation.id) : setConfirmBlock(true))}
          />
        </SettingsSection>
      </ScrollView>

      <ActionSheet
        visible={confirmBlock}
        title={`Block ${conversation.name}?`}
        message="Blocking is saved on this device only for now."
        actions={[
          {
            label: 'Block',
            destructive: true,
            onPress: () => {
              block(conversation.id);
              setConfirmBlock(false);
            },
          },
        ]}
        onClose={() => setConfirmBlock(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl, gap: spacing.lg },
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  empty: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
});
