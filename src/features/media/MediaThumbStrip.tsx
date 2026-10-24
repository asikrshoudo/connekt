import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { FlatList, Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useColors } from '../../core/theme/ThemeProvider';
import type { MediaItem } from '../../types/chat';

const THUMB = 44;
const SLOT = THUMB + 4;
export const STRIP_HEIGHT = 58;

type Props = {
  items: MediaItem[];
  current: number;
  onSelect: (index: number) => void;
};

export function MediaThumbStrip({ items, current, onSelect }: Props) {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<MediaItem>>(null);
  const pad = (width - THUMB) / 2;

  useEffect(() => {
    listRef.current?.scrollToIndex({ index: current, viewPosition: 0.5, animated: true });
  }, [current]);

  return (
    <View style={styles.strip}>
      <FlatList
        ref={listRef}
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={current}
        getItemLayout={(_, index) => ({ length: SLOT, offset: pad + SLOT * index, index })}
        keyExtractor={(item, index) => `${item.uri}-${index}`}
        ListHeaderComponent={<View style={{ width: pad }} />}
        ListFooterComponent={<View style={{ width: pad }} />}
        renderItem={({ item, index }) => {
          const selected = index === current;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Show item ${index + 1}`}
              onPress={() => onSelect(index)}
              style={styles.slot}
            >
              <View
                style={[
                  styles.thumb,
                  {
                    backgroundColor: colors.surface,
                    opacity: selected ? 1 : 0.55,
                    borderColor: selected ? colors.textPrimary : 'transparent',
                    transform: [{ scale: selected ? 1.15 : 1 }],
                  },
                ]}
              >
                <Image
                  source={{ uri: item.uri }}
                  resizeMode="cover"
                  fadeDuration={0}
                  style={StyleSheet.absoluteFill}
                />
                {item.kind === 'video' ? (
                  <View style={styles.play}>
                    <Ionicons name="play" size={16} color="#FFFFFF" />
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { height: STRIP_HEIGHT, alignSelf: 'stretch' },
  slot: { width: SLOT, height: STRIP_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 6,
    borderWidth: 2,
    overflow: 'hidden',
  },
  play: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});
