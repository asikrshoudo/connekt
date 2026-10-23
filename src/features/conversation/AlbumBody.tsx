import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { useColors } from '../../core/theme/ThemeProvider';
import type { MediaItem } from '../../types/chat';
import { formatDuration } from '../../utils/format';
import { albumLayout } from './albums';

type Props = {
  items: MediaItem[];
  onOpen?: (index: number) => void;
  onLongPress?: () => void;
};

// Many photos in one frame. Tiles can be opened one by one, and a long press still
// opens the message menu.
export function AlbumBody({ items, onOpen, onLongPress }: Props) {
  const colors = useColors();
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(260, Math.round(screenWidth * 0.68));
  const layout = useMemo(() => albumLayout(items.length, width), [items.length, width]);

  return (
    <View style={[styles.root, { width: layout.width, height: layout.height }]}>
      {layout.tiles.map((rect, index) => {
        const item = items[index];
        if (!item) return null;
        const showMore = index === layout.tiles.length - 1 && layout.hidden > 0;
        return (
          <Pressable
            key={`${item.uri}-${index}`}
            accessibilityRole="button"
            accessibilityLabel={`${item.kind === 'video' ? 'Video' : 'Photo'} ${index + 1} of ${items.length}`}
            onPress={() => onOpen?.(index)}
            onLongPress={onLongPress}
            delayLongPress={250}
            style={[
              styles.tile,
              {
                left: rect.x,
                top: rect.y,
                width: rect.width,
                height: rect.height,
                backgroundColor: colors.surfaceElevated,
              },
            ]}
          >
            <Image
              source={{ uri: item.uri }}
              resizeMode="cover"
              resizeMethod="resize"
              style={StyleSheet.absoluteFill}
            />
            {item.kind === 'video' && !showMore ? (
              <>
                <View style={styles.center}>
                  <Ionicons name="play-circle" size={34} color={colors.onAccent} />
                </View>
                <View style={[styles.chip, { backgroundColor: colors.scrim }]}>
                  <AppText variant="caption" style={{ color: colors.onAccent }}>
                    {formatDuration(item.durationMs)}
                  </AppText>
                </View>
              </>
            ) : null}
            {showMore ? (
              <View style={[styles.center, { backgroundColor: colors.scrim }]}>
                <AppText variant="title" style={{ color: colors.onAccent }}>
                  {`+${layout.hidden}`}
                </AppText>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { borderRadius: 18, overflow: 'hidden' },
  tile: { position: 'absolute', overflow: 'hidden' },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  chip: {
    position: 'absolute',
    left: 4,
    bottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
});
