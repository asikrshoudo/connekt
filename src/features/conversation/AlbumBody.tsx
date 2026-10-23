import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useRef, type ComponentRef } from 'react';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { useColors } from '../../core/theme/ThemeProvider';
import type { MediaItem } from '../../types/chat';
import { formatDuration } from '../../utils/format';
import { albumLayout, type TileRect } from './albums';
import type { Rect } from './types';

type Props = {
  items: MediaItem[];
  onOpen?: (index: number, rect: Rect) => void;
  onLongPress?: () => void;
};

type TileProps = {
  item: MediaItem;
  rect: TileRect;
  index: number;
  count: number;
  hiddenCount: number;
  onOpen?: (index: number, rect: Rect) => void;
  onLongPress?: () => void;
};

function AlbumTile({ item, rect, index, count, hiddenCount, onOpen, onLongPress }: TileProps) {
  const colors = useColors();
  const ref = useRef<ComponentRef<typeof View>>(null);

  // The viewer grows the photo out of this tile, so it needs to know where the tile is.
  const open = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      onOpen?.(index, { x, y, width, height });
    });
  };

  return (
    <Pressable
      ref={ref}
      collapsable={false}
      accessibilityRole="button"
      accessibilityLabel={`${item.kind === 'video' ? 'Video' : 'Photo'} ${index + 1} of ${count}`}
      onPress={open}
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
      {item.kind === 'video' && hiddenCount === 0 ? (
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
      {hiddenCount > 0 ? (
        <View style={[styles.center, { backgroundColor: colors.scrim }]}>
          <AppText variant="title" style={{ color: colors.onAccent }}>
            {`+${hiddenCount}`}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

// Many photos in one frame. Each tile opens its own photo, and a long press still opens
// the message menu.
export function AlbumBody({ items, onOpen, onLongPress }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(260, Math.round(screenWidth * 0.68));
  const layout = useMemo(() => albumLayout(items.length, width), [items.length, width]);

  return (
    <View style={[styles.root, { width: layout.width, height: layout.height }]}>
      {layout.tiles.map((rect, index) => {
        const item = items[index];
        if (!item) return null;
        return (
          <AlbumTile
            key={`${item.uri}-${index}`}
            item={item}
            rect={rect}
            index={index}
            count={items.length}
            hiddenCount={index === layout.tiles.length - 1 ? layout.hidden : 0}
            onOpen={onOpen}
            onLongPress={onLongPress}
          />
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
