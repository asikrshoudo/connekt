import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { PillButton } from '../../components/ui/PillButton';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { useChats } from '../chats/ChatsProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'BlockedContacts'>;

export function BlockedContactsScreen({ navigation }: Props) {
  const colors = useColors();
  const { blockedList, unblock } = useChats();

  return (
    <Screen>
      <ScreenHeader title="Blocked contacts" onBack={() => navigation.goBack()} />
      <FlatList
        data={blockedList}
        keyExtractor={(entry) => entry.id}
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={
          blockedList.length > 0 ? (
            <AppText variant="footnote" tone="muted" style={styles.note}>
              Blocking is saved on this device only for now.
            </AppText>
          ) : undefined
        }
        ListEmptyComponent={
          <EmptyState title="No blocked contacts" message="People you block will appear here." />
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Avatar name={item.name} size={44} />
            <View style={[styles.body, { borderBottomColor: colors.border }]}>
              <AppText variant="headline" numberOfLines={1} style={styles.name}>
                {item.name}
              </AppText>
              <PillButton label="Unblock" variant="subtle" onPress={() => unblock(item.id)} />
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: { flex: 1 },
});
