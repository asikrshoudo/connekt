import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius } from '../../core/theme/radius';
import { useColors } from '../../core/theme/ThemeProvider';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
const ITEM_WIDTH = 44;
const PADDING = 8;

export const REACTION_BAR_HEIGHT = 52;
export const REACTION_BAR_WIDTH = EMOJIS.length * ITEM_WIDTH + PADDING * 2;

type Props = { selected?: string; onSelect: (emoji: string) => void };

export function ReactionBar({ selected, onSelect }: Props) {
  const colors = useColors();
  return (
    <View style={[styles.bar, { backgroundColor: colors.surfaceElevated }]}>
      {EMOJIS.map((emoji) => (
        <Pressable
          key={emoji}
          accessibilityRole="button"
          accessibilityLabel={`React with ${emoji}`}
          accessibilityState={{ selected: selected === emoji }}
          onPress={() => onSelect(emoji)}
          style={[
            styles.item,
            selected === emoji && { backgroundColor: colors.tabIndicator },
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </Pressable>
      ))}
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
    elevation: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
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
  emoji: { fontSize: 24, lineHeight: 30, includeFontPadding: false },
});
