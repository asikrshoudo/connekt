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
import type { Message } from '../../types/chat';
import { useChats } from '../chats/ChatsProvider';
import { collectShared } from '../contacts/sharedMedia';
import { SharedMediaGrid } from '../contacts/SharedMediaGrid';
import { MemberRow } from './MemberRow';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupInfo'>;

export function GroupInfoScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { getConversation, getMessages, leaveGroup } = useChats();
  const conversation = getConversation(conversationId);
  const messages = getMessages(conversationId);
  const shared = useMemo(() => collectShared(messages), [messages]);
  const [confirmLeave, setConfirmLeave] = useState(false);

  if (!conversation) {
    return (
      <Screen>
        <ScreenHeader title="Group info" onBack={() => navigation.goBack()} />
        <EmptyState title="Group not found" message="This group is no longer available." />
      </Screen>
    );
  }

  const members = conversation.members ?? [];

  const openMedia = (message: Message) => {
    const attachment = message.attachment;
    if (attachment && (attachment.kind === 'image' || attachment.kind === 'video')) {
      navigation.navigate('MediaViewer', { uri: attachment.uri, kind: attachment.kind });
    }
  };

  const leave = () => {
    setConfirmLeave(false);
    leaveGroup(conversation.id);
    navigation.popToTop();
  };

  return (
    <Screen>
      <ScreenHeader title="Group info" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Avatar name={conversation.name} size={96} group />
          <AppText variant="title">{conversation.name}</AppText>
          <AppText variant="footnote" tone="muted">
            {`${members.length + 1} members`}
          </AppText>
        </View>

        <View>
          <SectionHeader title="Members" />
          <SettingsSection>
            <MemberRow name="You" you />
            {members.map((member) => (
              <MemberRow key={member.id} name={member.name} />
            ))}
          </SettingsSection>
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

        <SettingsSection footer="Leaving removes this group from this device. No one is notified, because Connekt has no server yet.">
          <SettingsRow
            icon="exit-outline"
            label="Leave group"
            destructive
            onPress={() => setConfirmLeave(true)}
          />
        </SettingsSection>
      </ScrollView>

      <ActionSheet
        visible={confirmLeave}
        title={`Leave ${conversation.name}?`}
        message="The group will be removed from this device."
        actions={[{ label: 'Leave group', destructive: true, onPress: leave }]}
        onClose={() => setConfirmLeave(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl, gap: spacing.lg },
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  empty: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
});
