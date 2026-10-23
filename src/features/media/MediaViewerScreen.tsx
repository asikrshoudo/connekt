import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { DarkScope, useColors } from '../../core/theme/ThemeProvider';
import type { MediaItem } from '../../types/chat';
import type { Rect } from '../conversation/types';
import { fitRect, pageIndex, shrinkRect } from './viewerGeometry';
import { VideoPlayerView } from './VideoPlayerView';

type Props = NativeStackScreenProps<RootStackParamList, 'MediaViewer'>;
type Phase = 'opening' | 'open' | 'closing';

const OPEN_MS = 300;
const CLOSE_MS = 240;
const VIEWER_BACKGROUND = '#000000';
const TILE_RADIUS = 12;

function ViewerContent({ route, navigation }: Props) {
  const { items, index: startIndex, origin } = route.params;
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const targetFor = (index: number): Rect => {
    const item = items[index];
    return fitRect(item?.width ?? 0, item?.height ?? 0, width, height);
  };

  // The tapped tile is where the photo grows from. Any other photo just fades in and out.
  const fromFor = (index: number): { rect: Rect; fallback: boolean } =>
    index === startIndex && origin
      ? { rect: origin, fallback: false }
      : { rect: shrinkRect(targetFor(index), 0.6), fallback: true };

  const first = fromFor(startIndex);
  const progress = useSharedValue(0);
  const fromRect = useSharedValue<Rect>(first.rect);
  const toRect = useSharedValue<Rect>(targetFor(startIndex));
  const fading = useSharedValue(first.fallback);

  const [phase, setPhase] = useState<Phase>('opening');
  const [current, setCurrent] = useState(startIndex);
  const [heroIndex, setHeroIndex] = useState(startIndex);
  const currentRef = useRef(startIndex);
  const closingRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const heroStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      left: interpolate(p, [0, 1], [fromRect.value.x, toRect.value.x]),
      top: interpolate(p, [0, 1], [fromRect.value.y, toRect.value.y]),
      width: interpolate(p, [0, 1], [fromRect.value.width, toRect.value.width]),
      height: interpolate(p, [0, 1], [fromRect.value.height, toRect.value.height]),
      borderRadius: interpolate(p, [0, 1], [fading.value ? 0 : TILE_RADIUS, 0]),
      opacity: fading.value ? p : 1,
    };
  });
  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: OPEN_MS,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
    timers.current.push(setTimeout(() => setPhase('open'), OPEN_MS + 40));
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
    // Runs once, when the viewer opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const index = currentRef.current;
    const from = fromFor(index);
    fromRect.value = from.rect;
    toRect.value = targetFor(index);
    fading.value = from.fallback;
    setHeroIndex(index);
    setPhase('closing');
    progress.value = withTiming(0, {
      duration: CLOSE_MS,
      easing: Easing.in(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
    timers.current.push(setTimeout(() => navigation.goBack(), CLOSE_MS + 30));
  };

  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      closeRef.current();
      return true;
    });
    return () => subscription.remove();
  }, []);

  const heroItem = items[heroIndex];

  return (
    <View style={styles.root}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
      />

      {phase === 'open' ? (
        <>
          <FlatList
            data={items}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={startIndex}
            extraData={current}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            keyExtractor={(item, index) => `${item.uri}-${index}`}
            onMomentumScrollEnd={(event) => {
              const next = pageIndex(event.nativeEvent.contentOffset.x, width, items.length);
              currentRef.current = next;
              setCurrent(next);
            }}
            renderItem={({ item, index }) => (
              <View style={{ width, height }}>
                {item.kind === 'video' && index === current ? (
                  <VideoPlayerView uri={item.uri} />
                ) : (
                  <Image
                    source={{ uri: item.uri }}
                    resizeMode="contain"
                    fadeDuration={0}
                    accessibilityLabel={item.kind === 'video' ? 'Video' : 'Photo'}
                    style={StyleSheet.absoluteFill}
                  />
                )}
              </View>
            )}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={close}
            style={[styles.close, { top: insets.top + spacing.sm, backgroundColor: colors.scrim }]}
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
          {items.length > 1 ? (
            <View
              pointerEvents="none"
              style={[styles.counter, { top: insets.top + spacing.sm, backgroundColor: colors.scrim }]}
            >
              <AppText variant="callout">{`${current + 1} / ${items.length}`}</AppText>
            </View>
          ) : null}
        </>
      ) : null}

      {phase !== 'open' && heroItem ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.hero, { backgroundColor: colors.surface }, heroStyle]}
        >
          <Image
            source={{ uri: heroItem.uri }}
            resizeMode="cover"
            fadeDuration={0}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

export function MediaViewerScreen(props: Props) {
  return (
    <DarkScope>
      <ViewerContent {...props} />
    </DarkScope>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdrop: { backgroundColor: VIEWER_BACKGROUND },
  hero: { position: 'absolute', overflow: 'hidden' },
  close: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
});
