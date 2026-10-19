import Ionicons from '@expo/vector-icons/Ionicons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import type { Attachment } from '../../types/chat';
import { formatDuration, formatFileSize } from '../../utils/format';

type Kind<K extends Attachment['kind']> = Extract<Attachment, { kind: K }>;

const MAX_WIDTH = 240;
const MAX_HEIGHT = 320;

export function MediaThumb({ attachment }: { attachment: Kind<'image'> | Kind<'video'> }) {
  const colors = useColors();
  const ratio =
    attachment.width > 0 && attachment.height > 0 ? attachment.width / attachment.height : 1;
  let width = MAX_WIDTH;
  let height = width / ratio;
  if (height > MAX_HEIGHT) {
    height = MAX_HEIGHT;
    width = height * ratio;
  }

  return (
    <View
      style={[
        styles.media,
        {
          width: Math.max(width, 120),
          height: Math.max(height, 90),
          backgroundColor: colors.surfaceElevated,
        },
      ]}
    >
      {attachment.kind === 'image' ? (
        <Image
          source={{ uri: attachment.uri }}
          resizeMode="cover"
          accessibilityLabel="Photo"
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <>
          <View style={styles.playWrap}>
            <View style={[styles.play, { backgroundColor: colors.scrim }]}>
              <Ionicons name="play" size={26} color={colors.textPrimary} />
            </View>
          </View>
          <View style={[styles.chip, { backgroundColor: colors.scrim }]}>
            <AppText variant="caption">{formatDuration(attachment.durationMs)}</AppText>
          </View>
        </>
      )}
    </View>
  );
}

export function VoiceBody({ attachment, outgoing }: { attachment: Kind<'voice'>; outgoing: boolean }) {
  const colors = useColors();
  const player = useAudioPlayer(attachment.uri);
  const status = useAudioPlayerStatus(player);
  const foreground = outgoing ? colors.onAccent : colors.textPrimary;
  const progress = status.duration > 0 ? Math.min(1, status.currentTime / status.duration) : 0;

  const toggle = () => {
    if (status.playing) {
      player.pause();
      return;
    }
    // expo-audio does not rewind by itself when a clip ends.
    if (status.duration > 0 && status.currentTime >= status.duration - 0.1) {
      void player.seekTo(0);
    }
    player.play();
  };

  return (
    <View style={styles.voice}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={status.playing ? 'Pause voice message' : 'Play voice message'}
        onPress={toggle}
        style={[
          styles.playButton,
          { backgroundColor: outgoing ? 'rgba(255,255,255,0.22)' : colors.tabIndicator },
        ]}
      >
        <Ionicons name={status.playing ? 'pause' : 'play'} size={18} color={foreground} />
      </Pressable>
      <View style={[styles.track, { backgroundColor: foreground + '40' }]}>
        <View
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            borderRadius: 2,
            backgroundColor: foreground,
          }}
        />
      </View>
      <AppText variant="footnote" style={{ color: foreground }}>
        {formatDuration(attachment.durationMs)}
      </AppText>
    </View>
  );
}

export function FileBody({ attachment, outgoing }: { attachment: Kind<'file'>; outgoing: boolean }) {
  const colors = useColors();
  const foreground = outgoing ? colors.onAccent : colors.textPrimary;
  const size = formatFileSize(attachment.size);
  return (
    <View style={styles.file}>
      <Ionicons name="document-outline" size={30} color={foreground} />
      <View style={styles.fileText}>
        <AppText variant="callout" numberOfLines={2} style={{ color: foreground }}>
          {attachment.name}
        </AppText>
        <AppText variant="footnote" style={{ color: foreground, opacity: 0.75 }}>
          {size ? `${size} · Tap to open` : 'Tap to open'}
        </AppText>
      </View>
    </View>
  );
}

export function LocationBody({
  attachment,
  outgoing,
}: {
  attachment: Kind<'location'>;
  outgoing: boolean;
}) {
  const colors = useColors();
  const foreground = outgoing ? colors.onAccent : colors.textPrimary;
  return (
    <View style={styles.file}>
      <Ionicons name="location" size={28} color={foreground} />
      <View style={styles.fileText}>
        <AppText variant="callout" style={{ color: foreground }}>
          Location
        </AppText>
        <AppText variant="footnote" style={{ color: foreground, opacity: 0.75 }}>
          {attachment.latitude.toFixed(5)}, {attachment.longitude.toFixed(5)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  media: { borderRadius: 18, overflow: 'hidden' },
  playWrap: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  play: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  chip: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  voice: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minWidth: 190 },
  playButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  file: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minWidth: 190 },
  fileText: { flex: 1, gap: 2 },
});
