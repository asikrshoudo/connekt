import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { spring } from '../../core/theme/motion';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from '../ui/AppText';
import type { TabItemConfig } from './tabConfig';

type Props = {
  config: TabItemConfig;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

export function TabBarItem({ config, focused, onPress, onLongPress }: Props) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const animateTo = (value: number) => {
    scale.value = withSpring(value, { ...spring.snappy, reduceMotion: ReduceMotion.System });
  };

  const color = focused ? colors.textPrimary : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={config.label}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => animateTo(0.92)}
      onPressOut={() => animateTo(1)}
      style={styles.item}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        <Ionicons name={focused ? config.iconFocused : config.icon} size={22} color={color} />
        <AppText variant="caption" numberOfLines={1} style={{ color }}>
          {config.label}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', gap: 2 },
});
