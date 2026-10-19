import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { PillButton } from '../../components/ui/PillButton';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SettingsSection } from '../../components/ui/SettingsSection';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import type { Member } from '../../types/chat';
import { MAX_GROUP_NAME, MIN_GROUP_MEMBERS } from '../chats/chatsState';
import { useChats } from '../chats/ChatsProvider';
import { useContacts } from '../contacts/ContactsProvider';
import { ProfileField } from '../profile/ProfileField';
import { EditableMemberRow } from './EditableMemberRow';
import { MemberRow } from './MemberRow';

type Props = NativeStackScreenProps<RootStackParamList, 'EditGroup'>;

export function EditGroupScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { getConversation, updateGroup } = useChats();
  const { contacts } = useContacts();
  const conversation = getConversation(conversationId);
  const [name, setName] = useState(conversation?.name ?? '');
  const [members, setMembers] = useState<Member[]>(conversation?.members ?? []);

  if (!conversation || conversation.members === undefined) {
    return (
      <Screen>
        <ScreenHeader title="Edit group" onBack={() => navigation.goBack()} />
        <EmptyState title="Group not found" message="This group is no longer available." />
      </Screen>
    );
  }

  const original = conversation.members;
  const candidates = contacts.filter((contact) => !members.some((m) => m.id === contact.id));
  const canRemove = members.length > MIN_GROUP_MEMBERS;
  const changed =
    name.trim() !== conversation.name ||
    members.length !== original.length ||
    members.some((member) => !original.some((other) => other.id === member.id));
  const canSave = name.trim().length > 0 && members.length >= MIN_GROUP_MEMBERS && changed;

  const save = () => {
    if (!canSave) return;
    updateGroup(conversation.id, name.trim(), members);
    navigation.goBack();
  };

  return (
    <Screen>
      <ScreenHeader title="Edit group" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <ProfileField
            label="Group name"
            value={name}
            onChangeText={setName}
            maxLength={MAX_GROUP_NAME}
          />

          <View>
            <SectionHeader title={`Members (${members.length + 1})`} />
            <SettingsSection
              footer={
                canRemove ? undefined : `A group needs at least ${MIN_GROUP_MEMBERS} other people.`
              }
            >
              <MemberRow name="You" you />
              {members.map((member) => (
                <EditableMemberRow
                  key={member.id}
                  name={member.name}
                  action="remove"
                  disabled={!canRemove}
                  onPress={() => setMembers(members.filter((m) => m.id !== member.id))}
                />
              ))}
            </SettingsSection>
          </View>

          <View>
            <SectionHeader title="Add people" />
            {candidates.length === 0 ? (
              <AppText tone="muted" style={styles.empty}>
                Everyone in your contacts is already in this group.
              </AppText>
            ) : (
              <SettingsSection>
                {candidates.map((contact) => (
                  <EditableMemberRow
                    key={contact.id}
                    name={contact.name}
                    action="add"
                    onPress={() => setMembers([...members, { id: contact.id, name: contact.name }])}
                  />
                ))}
              </SettingsSection>
            )}
          </View>

          <AppText variant="footnote" tone="muted" style={styles.note}>
            Changes are saved on this device only. No one is notified, because Connekt has no
            server yet.
          </AppText>
        </ScrollView>
        <View style={styles.footer}>
          <PillButton size="large" label="Save" onPress={save} disabled={!canSave} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: spacing.sm, paddingBottom: spacing.xl, gap: spacing.lg },
  empty: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  note: { paddingHorizontal: spacing.xl },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});
