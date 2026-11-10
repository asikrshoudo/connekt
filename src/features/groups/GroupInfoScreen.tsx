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
import { useChats } from '../chats/ChatsProvider';
import { collectShared } from '../contacts/sharedMedia';
import { SharedMediaGrid } from '../contacts/SharedMediaGrid';
import { MemberRow } from './MemberRow';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupInfo'>;

export function GroupInfoScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const colors = useColors();
  const { getConversation, getMessages, leaveGroup } = useChats();
  const conversation = getConversation(conversationId);
  const messages = getMessages(conversationId);
  const shared = useMemo(() => collectShared(messages), [messages]);
  const [confirmLeave, setConfirmLeave] = useState(false);

  if (!conversation) {
    return (
      <Screen>
        <ScreenHeader title="Team Details" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="people-outline"
          title="Team not found"
          message="This channel or group conversation is no longer available."
        />
      </Screen>
    );
  }

  const members = conversation.members ?? [];

  const openMedia = (index: number, rect: Rect) => {
    navigation.navigate('MediaViewer', {
      items: shared.media.map((entry) => entry.item),
      index,
      origin: rect,
    });
  };

  const leave = () => {
    setConfirmLeave(false);
    leaveGroup(conversation.id);
    navigation.popToTop();
  };

  return (
    <Screen>
      <ScreenHeader
        title="Team Details"
        onBack={() => navigation.goBack()}
        right={
          <PillButton
            label="Edit"
            variant="tonal"
            size="small"
            onPress={() => navigation.navigate('EditGroup', { conversationId })}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Team Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Avatar name={conversation.name} size={84} group />
          <View style={styles.heroText}>
            <AppText variant="title" style={styles.groupName}>
              {conversation.name}
            </AppText>
            <View style={[styles.channelBadge, { backgroundColor: colors.primaryContainer }]}>
              <Ionicons name="people" size={13} color={colors.accent} />
              <AppText variant="captionSmall" style={{ color: colors.accent, fontWeight: '700' }}>
                {`${members.length + 1} MEMBERS`}
              </AppText>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <PillButton
              label="Open Chat"
              variant="filled"
              size="medium"
              icon="chatbubble-outline"
              onPress={() => navigation.goBack()}
              style={styles.flexBtn}
            />
            <PillButton
              label="Edit Group"
              variant="subtle"
              size="medium"
              icon="create-outline"
              onPress={() => navigation.navigate('EditGroup', { conversationId })}
              style={styles.flexBtn}
            />
          </View>
        </View>

        {/* Members Section */}
        <View>
          <SectionHeader title={`Team Members (${members.length + 1})`} />
          <SettingsSection>
            <MemberRow name="You" you />
            {members.map((member) => (
              <MemberRow key={member.id} name={member.name} />
            ))}
          </SettingsSection>
        </View>

        {/* Shared Media */}
        <View>
          <SectionHeader title={`Shared Media (${shared.media.length})`} />
          {shared.media.length === 0 ? (
            <View
              style={[
                styles.emptyMediaCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Ionicons name="images-outline" size={24} color={colors.textMuted} />
              <AppText variant="footnote" tone="secondary">
                No shared photos, videos, or attachments yet.
              </AppText>
            </View>
          ) : (
            <SharedMediaGrid items={shared.media} onOpen={openMedia} />
          )}
        </View>

        {/* Leave Team Option */}
        <SettingsSection footer="Leaving removes this team channel from your device.">
          <SettingsRow
            icon="exit-outline"
            label="Leave team conversation"
            destructive
            onPress={() => setConfirmLeave(true)}
          />
        </SettingsSection>
      </ScrollView>

      <ActionSheet
        visible={confirmLeave}
        title={`Leave ${conversation.name}?`}
        message="This channel will be removed from your conversation list."
        actions={[{ label: 'Leave group', destructive: true, onPress: leave }]}
        onClose={() => setConfirmLeave(false)}
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
  groupName: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  channelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  flexBtn: {
    flex: 1,
  },
  emptyMediaCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
