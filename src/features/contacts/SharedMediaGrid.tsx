import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, type ComponentRef } from 'react';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import type { Rect } from '../conversation/types';
import type { SharedMedia } from './sharedMedia';

const COLUMNS = 3;
const GAP = 3;

type Props = { items: SharedMedia[]; onOpen: (index: number, rect: Rect) => void };

type TileProps = {
  entry: SharedMedia;
  size: number;
  index: number;
  onOpen: (index: number, rect: Rect) => void;
};

function GridTile({ entry, size, index, onOpen }: TileProps) {
  const colors = useColors();
  const ref = useRef<ComponentRef<typeof View>>(null);
  const { item } = entry;

  const open = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      onOpen(index, { x, y, width, height });
    });
  };

  return (
    <Pressable
      ref={ref}
      collapsable={false}
      accessibilityRole="button"
      accessibilityLabel={item.kind === 'image' ? 'Photo' : 'Video'}
      onPress={open}
      style={[styles.tile, { width: size, height: size, backgroundColor: colors.surfaceElevated }]}
    >
      <Image
        source={{ uri: item.uri }}
        resizeMode="cover"
        resizeMethod="resize"
        style={StyleSheet.absoluteFill}
      />
      {item.kind === 'video' ? (
        <View style={styles.center}>
          <Ionicons name="play-circle" size={32} color={colors.onAccent} />
        </View>
      ) : null}
    </Pressable>
  );
}

export function SharedMediaGrid({ items, onOpen }: Props) {
  const { width } = useWindowDimensions();
  const size = Math.floor((width - spacing.lg * 2 - GAP * (COLUMNS - 1)) / COLUMNS);

  return (
    <View style={styles.grid}>
      {items.map((entry, index) => (
        <GridTile key={entry.key} entry={entry} size={size} index={index} onOpen={onOpen} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingHorizontal: spacing.lg },
  tile: { borderRadius: 6, overflow: 'hidden' },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
