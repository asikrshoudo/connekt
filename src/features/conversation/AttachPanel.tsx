import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { popIn } from '../../components/feedback/popKeyframe';
import { AppText } from '../../components/ui/AppText';
import type { IconName } from '../../components/ui/iconTypes';
import { PillButton } from '../../components/ui/PillButton';
import { usePermissions } from '../../core/permissions/PermissionsProvider';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import type { Attachment } from '../../types/chat';
import { formatDuration } from '../../utils/format';
import { useRecentMedia, type RecentItem } from './useRecentMedia';

export type AttachAction = 'photos' | 'videos' | 'camera' | 'file' | 'location';

const OPTIONS: { action: AttachAction; label: string; icon: IconName }[] = [
  { action: 'photos', label: 'Photos', icon: 'images-outline' },
  { action: 'videos', label: 'Videos', icon: 'videocam-outline' },
  { action: 'camera', label: 'Camera', icon: 'camera-outline' },
  { action: 'file', label: 'Files', icon: 'document-outline' },
  { action: 'location', label: 'Location', icon: 'location-outline' },
];

const MAX_SELECTED = 10;
const MARGIN = 12;
const TILE = 84;

type Props = {
  visible: boolean;
  // Top edge of the + button. The panel opens just above it.
  anchorY: number;
  onChoose: (action: AttachAction) => void;
  onSendMedia: (items: Attachment[]) => void;
  onNeedMedia: () => void;
  onClose: () => void;
};

function toAttachment(item: RecentItem): Attachment {
  return item.kind === 'video'
    ? {
        kind: 'video',
        uri: item.uri,
        width: item.width,
        height: item.height,
        durationMs: item.durationMs,
      }
    : { kind: 'image', uri: item.uri, width: item.width, height: item.height };
}

export function AttachPanel({
  visible,
  anchorY,
  onChoose,
  onSendMedia,
  onNeedMedia,
  onClose,
}: Props) {
  const colors = useColors();
  const { width, height } = useWindowDimensions();
  const { statuses } = usePermissions();
  const granted = statuses.media === 'granted';
  const items = useRecentMedia(visible && granted);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) setSelected([]);
  }, [visible]);

  const toggle = (id: string) =>
    setSelected((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      return current.length >= MAX_SELECTED ? current : [...current, id];
    });

  const send = () => {
    const byId = new Map(items.map((item) => [item.id, item] as const));
    const chosen = selected
      .map((id) => byId.get(id))
      .filter((item): item is RecentItem => item !== undefined);
    onSendMedia(chosen.map(toAttachment));
  };

  const panelWidth = Math.min(width - MARGIN * 2, 400);
  const bottom = Math.max(MARGIN, height - anchorY + 12);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel="Close"
        onPress={onClose}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
      />
      <Animated.View
        entering={popIn}
        style={[
          styles.panel,
          {
            left: MARGIN,
            bottom,
            width: panelWidth,
            backgroundColor: colors.surfaceElevated,
            transformOrigin: 'left bottom',
          },
        ]}
      >
        {granted ? (
          items.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.strip}
            >
              {items.map((item) => {
                const checked = selected.includes(item.id);
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    accessibilityLabel={
                      item.kind === 'video' ? `Video, ${formatDuration(item.durationMs)}` : 'Photo'
                    }
                    onPress={() => toggle(item.id)}
                    style={[styles.tile, { backgroundColor: colors.surface }]}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      resizeMode="cover"
                      resizeMethod="resize"
                      style={StyleSheet.absoluteFill}
                    />
                    {item.kind === 'video' ? (
                      <View style={[styles.badge, { backgroundColor: colors.scrim }]}>
                        <Ionicons name="play" size={10} color={colors.onAccent} />
                        <AppText variant="caption" style={{ color: colors.onAccent }}>
                          {formatDuration(item.durationMs)}
                        </AppText>
                      </View>
                    ) : null}
                    {checked ? (
                      <View style={[styles.check, { backgroundColor: colors.bubbleOutgoing }]}>
                        <Ionicons name="checkmark" size={14} color={colors.onAccent} />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <AppText tone="muted" style={styles.empty}>
              No photos or videos found.
            </AppText>
          )
        ) : (
          <View style={styles.allow}>
            <AppText variant="callout" tone="secondary" style={styles.center}>
              Allow access to see your recent photos and videos here.
            </AppText>
            <PillButton label="Allow access" variant="subtle" onPress={onNeedMedia} />
          </View>
        )}

        {selected.length > 0 ? (
          <View style={styles.sendRow}>
            <PillButton size="large" label={`Send ${selected.length}`} onPress={send} />
          </View>
        ) : null}

        <View style={[styles.options, { borderTopColor: colors.border }]}>
          {OPTIONS.map((option) => (
            <Pressable
              key={option.action}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              onPress={() => onChoose(option.action)}
              style={styles.option}
            >
              <View style={[styles.circle, { backgroundColor: colors.surface }]}>
                <Ionicons name={option.icon} size={24} color={colors.textPrimary} />
              </View>
              <AppText variant="caption" tone="secondary" numberOfLines={1}>
                {option.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    borderRadius: 22,
    paddingTop: spacing.md,
    elevation: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  strip: { gap: 6, paddingHorizontal: spacing.md },
  tile: { width: TILE, height: TILE, borderRadius: 12, overflow: 'hidden' },
  badge: {
    position: 'absolute',
    left: 4,
    bottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  check: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  allow: { alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  center: { textAlign: 'center' },
  sendRow: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  options: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  option: { flex: 1, alignItems: 'center', gap: 6 },
  circle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
