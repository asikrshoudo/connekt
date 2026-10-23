import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import type { MediaItem } from '../../types/chat';
import type { SharedMedia } from './sharedMedia';

const COLUMNS = 3;
const GAP = 3;

type Props = { items: SharedMedia[]; onOpen: (item: MediaItem) => void };

export function SharedMediaGrid({ items, onOpen }: Props) {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const tile = Math.floor((width - spacing.lg * 2 - GAP * (COLUMNS - 1)) / COLUMNS);

  return (
    <View style={styles.grid}>
      {items.map(({ key, item }) => (
        <Pressable
          key={key}
          accessibilityRole="button"
          accessibilityLabel={item.kind === 'image' ? 'Photo' : 'Video'}
          onPress={() => onOpen(item)}
          style={[
            styles.tile,
            { width: tile, height: tile, backgroundColor: colors.surfaceElevated },
          ]}
        >
          {item.kind === 'image' ? (
            <Image
              source={{ uri: item.uri }}
              resizeMode="cover"
              resizeMethod="resize"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={styles.center}>
              <Ionicons name="play-circle" size={32} color={colors.textPrimary} />
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingHorizontal: spacing.lg },
  tile: { borderRadius: 6, overflow: 'hidden' },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
