import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { PillButton } from '../../components/ui/PillButton';
import type { RootStackParamList } from '../../core/navigation/types';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { formatChatTime } from '../../utils/formatChatTime';
import { useChats } from '../chats/ChatsProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'RequestDetail'>;

export function RequestDetailScreen({ route, navigation }: Props) {
  const { requestId } = route.params;
  const colors = useColors();
  const { requests, acceptRequest, declineRequest, blockRequest } = useChats();
  const request = requests.find((r) => r.id === requestId);
  const [confirmBlock, setConfirmBlock] = useState(false);

  if (!request) {
    return (
      <Screen>
        <ScreenHeader title="Message request" onBack={() => navigation.goBack()} />
        <EmptyState title="Request not found" message="This request has already been handled." />
      </Screen>
    );
  }

  const accept = () => {
    acceptRequest(request.id);
    navigation.replace('Conversation', { conversationId: request.id });
  };

  const decline = () => {
    declineRequest(request.id);
    navigation.goBack();
  };

  const block = () => {
    setConfirmBlock(false);
    blockRequest(request.id);
    navigation.goBack();
  };

  return (
    <Screen>
      <ScreenHeader title="Message request" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Avatar name={request.name} size={96} />
          <AppText variant="title">{request.name}</AppText>
          <AppText variant="footnote" tone="muted">
            Not in your contacts
          </AppText>
        </View>

        <View style={[styles.message, { backgroundColor: colors.surface }]}>
          <AppText>{request.firstMessage}</AppText>
          <AppText variant="footnote" tone="muted">
            {formatChatTime(request.receivedAt)}
          </AppText>
        </View>

        <AppText variant="footnote" tone="muted" style={styles.note}>
          Accepting moves this chat to your Chats. Nothing is sent to {request.name}, because
          Connekt has no server yet.
        </AppText>

        <View style={styles.actions}>
          <PillButton size="large" label="Accept" onPress={accept} />
          <PillButton size="large" label="Decline" variant="subtle" onPress={decline} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Block ${request.name}`}
            onPress={() => setConfirmBlock(true)}
            style={styles.block}
          >
            <AppText style={{ color: colors.destructive }}>{`Block ${request.name}`}</AppText>
          </Pressable>
        </View>
      </ScrollView>

      <ActionSheet
        visible={confirmBlock}
        title={`Block ${request.name}?`}
        message="Blocking is saved on this device only for now."
        actions={[{ label: 'Block', destructive: true, onPress: block }]}
        onClose={() => setConfirmBlock(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl, gap: spacing.lg },
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  message: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  note: { paddingHorizontal: spacing.xl },
  actions: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  block: { height: 48, alignItems: 'center', justifyContent: 'center' },
});
