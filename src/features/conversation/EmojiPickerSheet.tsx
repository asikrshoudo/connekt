import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { EMOJI_CATEGORIES } from './emojiData';

const COLUMNS = 8;
const TAB_HEIGHT = 48;

type Props = {
  onPick: (emoji: string) => void;
  onClose: () => void;
};

export function EmojiPickerSheet({ onPick, onClose }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [categoryIndex, setCategoryIndex] = useState(0);
  const category = EMOJI_CATEGORIES[categoryIndex] ?? EMOJI_CATEGORIES[0]!;

  const cell = Math.floor((width - spacing.md * 2) / COLUMNS);
  const sheetHeight = Math.min(420, height * 0.5) + insets.bottom;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable
        accessibilityLabel="Close emoji picker"
        onPress={onClose}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
      />
      <Animated.View
        entering={SlideInDown.duration(220)}
        exiting={SlideOutDown.duration(160)}
        style={[
          styles.sheet,
          {
            height: sheetHeight,
            paddingBottom: insets.bottom,
            backgroundColor: colors.surfaceElevated,
          },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.textMuted }]} />
        <View style={styles.tabs}>
          {EMOJI_CATEGORIES.map((item, index) => (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.key}
              onPress={() => setCategoryIndex(index)}
              style={[
                styles.tab,
                index === categoryIndex && { backgroundColor: colors.tabIndicator },
              ]}
            >
              <Text style={styles.tabEmoji}>{item.icon}</Text>
            </Pressable>
          ))}
        </View>
        <FlatList
          key={category.key}
          data={category.emojis}
          numColumns={COLUMNS}
          keyExtractor={(emoji, index) => `${emoji}-${index}`}
          contentContainerStyle={{ paddingHorizontal: spacing.md }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`React with ${item}`}
              onPress={() => onPick(item)}
              style={{ width: cell, height: cell, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={styles.emoji}>{item}</Text>
            </Pressable>
          )}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    opacity: 0.5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    height: TAB_HEIGHT + 12,
    alignItems: 'center',
  },
  tab: {
    width: 44,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: { fontSize: 20, lineHeight: 26, includeFontPadding: false },
  emoji: { fontSize: 28, lineHeight: 36, includeFontPadding: false },
});
