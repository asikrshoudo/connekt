import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { PermissionRow } from '../../components/ui/PermissionRow';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import type { RootStackParamList } from '../../core/navigation/types';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { formatFileSize } from '../../utils/format';
import { useChats } from '../chats/ChatsProvider';
import { describeCounts, summarizeChatStorage } from './chatStorage';
import { clearCache, fileSize, isAppFile, readStorage, type StorageSnapshot } from './storageInfo';
import { StorageBar } from './StorageBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Storage'>;

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View style={styles.legend}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <AppText variant="captionSmall" tone="secondary" style={styles.legendLabel}>
        {label}
      </AppText>
      <AppText variant="captionSmall" style={styles.legendValue}>
        {value}
      </AppText>
    </View>
  );
}

export function StorageScreen({ navigation }: Props) {
  const colors = useColors();
  const { conversations, messagesByChat } = useChats();
  const [snapshot, setSnapshot] = useState<StorageSnapshot | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [freed, setFreed] = useState<number | null>(null);

  const refreshStorage = useCallback(() => {
    setSnapshot(readStorage());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshStorage();
    }, [refreshStorage]),
  );

  const rows = useMemo(
    () => summarizeChatStorage(conversations, messagesByChat, isAppFile, fileSize),
    [conversations, messagesByChat],
  );

  const clear = () => {
    setConfirmClear(false);
    setFreed(clearCache());
    refreshStorage();
  };

  const app = snapshot ? snapshot.cache + snapshot.documents : 0;
  const used = snapshot ? Math.max(0, snapshot.total - snapshot.free) : 0;
  const other = Math.max(0, used - app);

  return (
    <Screen>
      <ScreenHeader title="Storage and backup" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <AppText variant="headline" style={styles.cardTitle}>
            Local Device Storage
          </AppText>
          {snapshot ? (
            <>
              <AppText variant="callout" tone="secondary">
                {`${formatFileSize(used)} used of ${formatFileSize(snapshot.total)}`}
              </AppText>
              <StorageBar
                total={snapshot.total}
                segments={[
                  { value: app, color: colors.accent },
                  { value: other, color: colors.textMuted },
                ]}
              />
              <View style={styles.legendContainer}>
                <Legend color={colors.accent} label="Myth App & Media" value={formatFileSize(app)} />
                <Legend
                  color={colors.textMuted}
                  label="Other Apps & System"
                  value={formatFileSize(other)}
                />
                <Legend
                  color={colors.surfaceContainerHighest}
                  label="Available Free Space"
                  value={formatFileSize(snapshot.free)}
                />
              </View>
            </>
          ) : (
            <AppText tone="muted">Calculating storage breakdown...</AppText>
          )}
        </View>

        <SettingsSection
          title="Myth on this phone"
          footer="Files and recorded media are cached locally. Clearing the cache removes temporary files while preserving your conversations and contacts."
        >
          <SettingsRow
            icon="albums-outline"
            label="Media cache"
            value={snapshot ? formatFileSize(snapshot.cache) : '...'}
          />
          <SettingsRow
            icon="folder-outline"
            label="Saved documents"
            value={snapshot ? formatFileSize(snapshot.documents) : '...'}
          />
          <SettingsRow
            icon="trash-outline"
            label="Clear cache"
            destructive
            onPress={() => setConfirmClear(true)}
          />
        </SettingsSection>

        <View>
          <SectionHeader title="Chat Storage Breakdown" />
          {rows.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <AppText variant="footnote" tone="secondary">
                No media or attachments in your local conversations.
              </AppText>
            </View>
          ) : (
            <SettingsSection footer="Photos and videos from your phone gallery are not duplicated, saving device storage.">
              {rows.map((row) => (
                <PermissionRow
                  key={row.id}
                  icon="chatbubble-outline"
                  title={row.name}
                  description={describeCounts(row)}
                  trailing={
                    <AppText variant="callout" tone="secondary">
                      {formatFileSize(row.bytes)}
                    </AppText>
                  }
                />
              ))}
            </SettingsSection>
          )}
        </View>

        <SettingsSection
          title="Cloud and backup"
          footer="Cloud backups will be available with team workspace cloud sync."
        >
          <SettingsRow icon="cloud-outline" label="Cloud storage" value="Coming soon" disabled />
          <SettingsRow
            icon="cloud-upload-outline"
            label="Automated backup"
            value="Coming soon"
            disabled
          />
        </SettingsSection>
      </ScrollView>

      <ActionSheet
        visible={confirmClear}
        title="Clear media cache?"
        message={`This will remove ${formatFileSize(snapshot?.cache ?? 0)} of cached files. Text messages and contacts will remain intact.`}
        actions={[{ label: 'Clear cache', destructive: true, onPress: clear }]}
        onClose={() => setConfirmClear(false)}
      />

      <ActionSheet
        visible={freed !== null}
        title="Cache cleared"
        message={`Successfully freed ${formatFileSize(freed ?? 0)}.`}
        actions={[]}
        cancelLabel="Done"
        onClose={() => setFreed(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  card: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  cardTitle: {
    fontWeight: '700',
  },
  legendContainer: {
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  swatch: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    flex: 1,
  },
  legendValue: {
    fontWeight: '600',
  },
  emptyCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
