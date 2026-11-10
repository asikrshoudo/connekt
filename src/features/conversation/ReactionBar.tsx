import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius } from '../../core/theme/radius';
import { useColors } from '../../core/theme/ThemeProvider';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
const ITEM_WIDTH = 44;
const PADDING = 6;
const SLOTS = EMOJIS.length + 1; // + the "more" button

export const REACTION_BAR_HEIGHT = 48;
export const REACTION_BAR_WIDTH = SLOTS * ITEM_WIDTH + PADDING * 2;

type Props = {
  selected?: string;
  onSelect: (emoji: string) => void;
  onMore: () => void;
};

export function ReactionBar({ selected, onSelect, onMore }: Props) {
  const colors = useColors();
  const quick =
    selected && !EMOJIS.includes(selected) ? [...EMOJIS.slice(0, -1), selected] : EMOJIS;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {quick.map((emoji) => (
        <Pressable
          key={emoji}
          accessibilityRole="button"
          accessibilityLabel={`React with ${emoji}`}
          accessibilityState={{ selected: selected === emoji }}
          onPress={() => onSelect(emoji)}
          style={({ pressed }) => [
            styles.item,
            selected === emoji && { backgroundColor: colors.chipActiveBackground },
            pressed && { transform: [{ scale: 1.15 }] },
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </Pressable>
      ))}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="More emojis"
        onPress={onMore}
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      >
        <View style={[styles.more, { backgroundColor: colors.surfaceContainer }]}>
          <Ionicons name="add" size={18} color={colors.textPrimary} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: REACTION_BAR_WIDTH,
    height: REACTION_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    padding: PADDING,
    borderRadius: radius.pill,
    borderWidth: 1,
    elevation: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  item: {
    width: ITEM_WIDTH,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  more: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22, lineHeight: 28, includeFontPadding: false },
  pressed: {
    opacity: 0.75,
  },
});
