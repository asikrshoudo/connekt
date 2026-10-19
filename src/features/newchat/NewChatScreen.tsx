import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { SearchField } from '../../components/ui/SearchField';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import type { Contact } from '../../types/contact';
import { useChats } from '../chats/ChatsProvider';
import { SampleDataNotice } from '../chats/SampleDataNotice';
import { useContacts } from '../contacts/ContactsProvider';
import { NewGroupRow } from './NewGroupRow';

type Props = NativeStackScreenProps<RootStackParamList, 'NewChat'>;

export function NewChatScreen({ navigation }: Props) {
  const colors = useColors();
  const { contacts, isSample } = useContacts();
  const { startChat } = useChats();
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return contacts.filter((contact) => contact.name.toLowerCase().includes(needle));
  }, [contacts, query]);

  const open = (contact: Contact) => {
    startChat(contact.id, contact.name);
    navigation.replace('Conversation', { conversationId: contact.id });
  };

  return (
    <Screen>
      <ScreenHeader title="New chat" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search contacts" />
        {isSample ? <SampleDataNotice message="Contacts marked Sample are not real people." /> : null}
        <FlatList
          data={visible}
          keyExtractor={(contact) => contact.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.list}
          ListHeaderComponent={<NewGroupRow onPress={() => navigation.navigate('NewGroup')} />}
          ListEmptyComponent={
            <EmptyState title="No contacts found" message="Try a different name." />
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Message ${item.name}`}
              onPress={() => open(item)}
              style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surface }]}
            >
              <Avatar name={item.name} size={44} />
              <View style={[styles.body, { borderBottomColor: colors.border }]}>
                <AppText variant="headline">{item.name}</AppText>
                {item.sample ? (
                  <AppText variant="footnote" tone="muted">
                    Sample contact
                  </AppText>
                ) : null}
              </View>
            </Pressable>
          )}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { flexGrow: 1 },
  row: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg },
  body: {
    flex: 1,
    marginLeft: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
