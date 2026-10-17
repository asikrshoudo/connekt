import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { PillButton } from '../../components/ui/PillButton';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { typography } from '../../core/theme/typography';
import { useChats } from '../chats/ChatsProvider';
import { SampleDataNotice } from '../chats/SampleDataNotice';
import { useContacts } from '../contacts/ContactsProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'NewGroup'>;

const MIN_MEMBERS = 2;

export function NewGroupScreen({ navigation }: Props) {
  const colors = useColors();
  const { contacts, isSample } = useContacts();
  const { createGroup } = useChats();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  const canCreate = name.trim().length > 0 && selected.length >= MIN_MEMBERS;

  const create = () => {
    if (!canCreate) return;
    const members = contacts
      .filter((contact) => selected.includes(contact.id))
      .map((contact) => ({ id: contact.id, name: contact.name }));
    const id = createGroup(name.trim(), members);
    navigation.replace('Conversation', { conversationId: id });
  };

  return (
    <Screen>
      <ScreenHeader title="New group" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <View
          style={[
            styles.nameField,
            { backgroundColor: colors.surface, borderColor: colors.inputBorder },
          ]}
        >
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Group name"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Group name"
            maxLength={40}
            style={[styles.input, typography.callout, { color: colors.textPrimary }]}
          />
        </View>
        <AppText variant="footnote" tone="muted" style={styles.hint}>
          {`Choose at least ${MIN_MEMBERS} people (${selected.length} selected)`}
        </AppText>
        {isSample ? (
          <SampleDataNotice message="Sample contacts. The group stays on this device." />
        ) : null}
        <FlatList
          style={styles.flex}
          data={contacts}
          keyExtractor={(contact) => contact.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const checked = selected.includes(item.id);
            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={item.name}
                onPress={() => toggle(item.id)}
                style={({ pressed }) => [
                  styles.row,
                  pressed && { backgroundColor: colors.surface },
                ]}
              >
                <Avatar name={item.name} size={44} />
                <View style={[styles.body, { borderBottomColor: colors.border }]}>
                  <AppText variant="headline" style={styles.rowName}>
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
          <PillButton size="large" label="Create group" onPress={create} disabled={!canCreate} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  nameField: {
    height: 44,
    marginHorizontal: spacing.lg,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
  },
  input: { paddingHorizontal: spacing.lg, paddingVertical: 0 },
  hint: { paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
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
  rowName: { flex: 1 },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});
