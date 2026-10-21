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
      <AppText variant="footnote" tone="secondary" style={styles.legendLabel}>
        {label}
      </AppText>
      <AppText variant="footnote" tone="secondary">
        {value}
      </AppText>
    </View>
  );
}

export function StorageScreen({ navigation }: Props) {
  const colors = useColors();
  const { conversations, messagesByChat } = useChats();
  const [snapshot, setSnapshot] = useState<StorageSnapshot | null>(null);
  const [version, setVersion] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);
  const [freed, setFreed] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => setSnapshot(readStorage()), 0);
      return () => clearTimeout(timer);
    }, [version]),
  );

  const rows = useMemo(
    () => summarizeChatStorage(conversations, messagesByChat, isAppFile, fileSize),
    // The sizes can change when the snapshot is refreshed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversations, messagesByChat, snapshot],
  );

  const clear = () => {
    setConfirmClear(false);
    setFreed(clearCache());
    setVersion((value) => value + 1);
  };

  const app = snapshot ? snapshot.cache + snapshot.documents : 0;
  const used = snapshot ? Math.max(0, snapshot.total - snapshot.free) : 0;
  const other = Math.max(0, used - app);

  return (
    <Screen>
      <ScreenHeader title="Storage and backup" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <AppText variant="heading">Phone storage</AppText>
          {snapshot ? (
            <>
              <AppText tone="secondary">
                {`${formatFileSize(used)} used of ${formatFileSize(snapshot.total)}`}
              </AppText>
              <StorageBar
                total={snapshot.total}
                segments={[
                  { value: app, color: colors.accent },
                  { value: other, color: colors.textMuted },
                ]}
              />
              <Legend color={colors.accent} label="Connekt" value={formatFileSize(app)} />
              <Legend
                color={colors.textMuted}
                label="Other apps and files"
                value={formatFileSize(other)}
              />
              <Legend
                color={colors.surfaceElevated}
                label="Free"
                value={formatFileSize(snapshot.free)}
              />
            </>
          ) : (
            <AppText tone="muted">Measuring...</AppText>
          )}
        </View>

        <SettingsSection
          title="Connekt on this phone"
          footer="Files you send and voice messages you record are kept in the cache. Clearing it removes them from your chats. Messages and contacts stay."
        >
          <SettingsRow
            icon="albums-outline"
            label="Cache"
            value={snapshot ? formatFileSize(snapshot.cache) : '...'}
          />
          <SettingsRow
            icon="folder-outline"
            label="Saved files"
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
          <SectionHeader title="In your chats" />
          {rows.length === 0 ? (
            <AppText tone="muted" style={styles.empty}>
              No photos, videos, files or voice messages in your chats yet.
            </AppText>
          ) : (
            <SettingsSection footer="Photos and videos from your gallery are not copied by Connekt, so they use no extra space here.">
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
          footer="Cloud storage and backup need an account and a server, which Connekt does not have yet. Your space and limits will show here once they exist."
        >
          <SettingsRow icon="cloud-outline" label="Cloud storage" value="Not available" disabled />
          <SettingsRow
            icon="cloud-upload-outline"
            label="Cloud backup"
            value="Not available"
            disabled
          />
        </SettingsSection>

        <AppText variant="footnote" tone="muted" style={styles.note}>
          Saved on this phone: your profile, contacts you added, theme and settings. Chats are not
          saved yet and start fresh when Connekt restarts.
        </AppText>
      </ScrollView>

      <ActionSheet
        visible={confirmClear}
        title="Clear cache?"
        message={`This frees ${formatFileSize(snapshot?.cache ?? 0)}. Files and voice messages Connekt kept in your chats will stop opening. Messages stay.`}
        actions={[{ label: 'Clear cache', destructive: true, onPress: clear }]}
        onClose={() => setConfirmClear(false)}
      />

      <ActionSheet
        visible={freed !== null}
        title="Cache cleared"
        message={`${formatFileSize(freed ?? 0)} freed.`}
        actions={[]}
        cancelLabel="OK"
        onClose={() => setFreed(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl, gap: spacing.lg },
  card: { marginHorizontal: spacing.lg, gap: spacing.sm },
  legend: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  swatch: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { flex: 1 },
  empty: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  note: { paddingHorizontal: spacing.xl },
});
