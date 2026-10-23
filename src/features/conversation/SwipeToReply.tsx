import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { spring } from '../../core/theme/motion';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { isReplySwipe, REPLY_THRESHOLD, resistedOffset } from './swipeLogic';

type Props = {
  enabled?: boolean;
  onReply: () => void;
  children: ReactNode;
};

// Drag a message sideways, left or right, and let go to reply to it.
export function SwipeToReply({ enabled = true, onReply, children }: Props) {
  const colors = useColors();
  const offset = useSharedValue(0);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .enabled(enabled)
    .activeOffsetX([-12, 12])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      offset.value = resistedOffset(event.translationX);
    })
    .onEnd((event) => {
      if (isReplySwipe(event.translationX)) onReply();
    })
    .onFinalize(() => {
      offset.value = withSpring(0, { ...spring.snappy, reduceMotion: ReduceMotion.System });
    });

  const contentStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  // The reply icon shows on the side the message moved away from.
  const leftStyle = useAnimatedStyle(() => {
    const progress = offset.value > 0 ? Math.min(1, offset.value / REPLY_THRESHOLD) : 0;
    return { opacity: progress, transform: [{ scale: 0.6 + 0.4 * progress }] };
  });
  const rightStyle = useAnimatedStyle(() => {
    const progress = offset.value < 0 ? Math.min(1, -offset.value / REPLY_THRESHOLD) : 0;
    return { opacity: progress, transform: [{ scale: 0.6 + 0.4 * progress }] };
  });

  const icon = (
    <View style={[styles.circle, { backgroundColor: colors.surfaceElevated }]}>
      <Ionicons name="arrow-undo" size={18} color={colors.textPrimary} />
    </View>
  );

  return (
    <View>
      <Animated.View pointerEvents="none" style={[styles.icon, styles.left, leftStyle]}>
        {icon}
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.icon, styles.right, rightStyle]}>
        {icon}
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={contentStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: { position: 'absolute', top: 0, bottom: 0, justifyContent: 'center' },
  left: { left: spacing.lg },
  right: { right: spacing.lg },
  circle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
