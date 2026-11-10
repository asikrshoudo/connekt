import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { PillButton } from '../../components/ui/PillButton';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import type { RootStackParamList } from '../../core/navigation/types';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import type { Rect } from '../conversation/types';
import { formatFileSize } from '../../utils/format';
import { useChats } from '../chats/ChatsProvider';
import { collectShared } from './sharedMedia';
import { SharedMediaGrid } from './SharedMediaGrid';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactProfile'>;

export function ContactProfileScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const colors = useColors();
  const { getConversation, getMessages, isSample, isBlocked, block, unblock } = useChats();
  const [confirmBlock, setConfirmBlock] = useState(false);
  const conversation = getConversation(conversationId);
  const messages = getMessages(conversationId);
  const shared = useMemo(() => collectShared(messages), [messages]);

  if (!conversation) {
    return (
      <Screen>
        <ScreenHeader title="Contact Info" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="person-outline"
          title="Contact not found"
          message="This contact conversation is no longer available."
        />
      </Screen>
    );
  }

  const blocked = isBlocked(conversation.id);

  const openMedia = (index: number, rect: Rect) => {
    navigation.navigate('MediaViewer', {
      items: shared.media.map((entry) => entry.item),
      index,
      origin: rect,
    });
  };

  return (
    <Screen>
      <ScreenHeader title="Contact Info" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Contact Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Avatar name={conversation.name} size={84} presence="online" />
          <View style={styles.heroText}>
            <AppText variant="title" style={styles.name}>
              {conversation.name}
            </AppText>
            <View style={[styles.statusBadge, { backgroundColor: colors.primaryContainer }]}>
              <View style={[styles.dot, { backgroundColor: colors.presenceOnline }]} />
              <AppText variant="captionSmall" style={{ color: colors.accent, fontWeight: '700' }}>
                ACTIVE NOW
              </AppText>
            </View>
            {isSample ? (
              <AppText variant="captionSmall" tone="muted">
                Sample Contact
              </AppText>
            ) : null}
          </View>

          <View style={styles.actionButtons}>
            <PillButton
              label="Send Message"
              variant="filled"
              size="medium"
              icon="chatbubble-outline"
              onPress={() => navigation.goBack()}
              style={styles.flexBtn}
            />
          </View>
        </View>

        {/* Shared Media */}
        <View>
          <SectionHeader title={`Shared Media (${shared.media.length})`} />
          {shared.media.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Ionicons name="images-outline" size={24} color={colors.textMuted} />
              <AppText variant="footnote" tone="secondary">
                No photos or videos exchanged yet.
              </AppText>
            </View>
          ) : (
            <SharedMediaGrid items={shared.media} onOpen={openMedia} />
          )}
        </View>

        {/* Shared Files */}
        <View>
          <SectionHeader title={`Shared Files (${shared.files.length})`} />
          {shared.files.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Ionicons name="document-outline" size={24} color={colors.textMuted} />
              <AppText variant="footnote" tone="secondary">
                No files shared yet.
              </AppText>
            </View>
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

        {/* Block / Safety Controls */}
        <SettingsSection footer="Blocked contacts cannot send you direct messages on this device.">
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
        message="You will no longer receive notifications or messages from this contact."
        actions={[
          {
            label: 'Block Contact',
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
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  heroCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  heroText: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: spacing.xs,
  },
  flexBtn: {
    flex: 1,
  },
  emptyCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
