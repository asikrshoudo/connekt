import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const BAR_WIDTH = 3;
const BAR_GAP = 3;
const MAX_HEIGHT = 28;
const MIN_HEIGHT = 4;
const TICK_MS = 70;
const HISTORY = 80;

function Bar({ value, color }: { value: number; color: string }) {
  const height = useSharedValue(MIN_HEIGHT);

  useEffect(() => {
    height.value = withTiming(MIN_HEIGHT + value * (MAX_HEIGHT - MIN_HEIGHT), {
      duration: TICK_MS,
      easing: Easing.linear,
    });
  }, [value, height]);

  const style = useAnimatedStyle(() => ({ height: height.value }));
  return <Animated.View style={[styles.bar, { backgroundColor: color }, style]} />;
}

type Props = { level: number; color: string };

// A scrolling wave: new loudness enters on the right and moves left.
export function VoiceWaveform({ level, color }: Props) {
  const [width, setWidth] = useState(0);
  const [history, setHistory] = useState<number[]>(() => new Array(HISTORY).fill(0));
  const levelRef = useRef(level);
  levelRef.current = level;

  useEffect(() => {
    const timer = setInterval(() => {
      setHistory((previous) => [...previous.slice(1), levelRef.current]);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const count = Math.max(6, Math.floor(width / (BAR_WIDTH + BAR_GAP)));
  const bars = history.slice(-count);

  return (
    <View style={styles.wrap} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {bars.map((value, index) => (
        <Bar key={index} value={value} color={color} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: MAX_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: BAR_GAP,
    overflow: 'hidden',
  },
  bar: { width: BAR_WIDTH, borderRadius: BAR_WIDTH / 2 },
});
