import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MENU_WIDTH, MenuCard, type MenuItem } from '../../components/feedback/MenuCard';
import { popIn } from '../../components/feedback/popKeyframe';
import { AppText } from '../../components/ui/AppText';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { DarkScope, useColors } from '../../core/theme/ThemeProvider';
import type { MediaItem } from '../../types/chat';
import { EmojiPickerSheet } from '../conversation/EmojiPickerSheet';
import { ReactionBar } from '../conversation/ReactionBar';
import type { Rect } from '../conversation/types';
import { MediaThumbStrip } from './MediaThumbStrip';
import { fitRect, pageIndex, shrinkRect } from './viewerGeometry';
import { VideoPlayerView } from './VideoPlayerView';

type Props = NativeStackScreenProps<RootStackParamList, 'MediaViewer'>;
type Phase = 'opening' | 'open' | 'closing';

// Drives which layer is visible, on the UI thread, so swaps never wait for React.
const MODE_OPENING = 0;
const MODE_OPEN = 1;
const MODE_CLOSE_HERO = 2;
const MODE_CLOSE_FADE = 3;

const OPEN_MS = 300;
const CLOSE_MS = 240;
const VIEWER_BACKGROUND = '#000000';
const TILE_RADIUS = 12;
const BUTTON = 40;

function ViewerContent({ route, navigation }: Props) {
  const { items, index: startIndex, origin } = route.params;
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const sizes = useRef<Record<number, { w: number; h: number }>>({});
  const targetFor = (index: number): Rect => {
    const known = sizes.current[index];
    const item = items[index];
    return fitRect(known?.w ?? item?.width ?? 0, known?.h ?? item?.height ?? 0, width, height);
  };

  const progress = useSharedValue(0);
  const fromRect = useSharedValue<Rect>(origin ?? shrinkRect(targetFor(startIndex), 0.6));
  const toRect = useSharedValue<Rect>(targetFor(startIndex));
  const fading = useSharedValue(!origin);
  const mode = useSharedValue(MODE_OPENING);

  const [phase, setPhase] = useState<Phase>('opening');
  const [animDone, setAnimDone] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(startIndex);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reactions, setReactions] = useState<Record<string, string>>({});

  const currentRef = useRef(startIndex);
  const closingRef = useRef(false);
  const overlayOpenRef = useRef(false);
  const pagerRef = useRef<FlatList<MediaItem>>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  overlayOpenRef.current = menuOpen || reacting || pickerOpen;

  // Only the tapped photo ever flies in or out; it is shown by this always-mounted layer.
  const heroStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const shown = mode.value === MODE_OPENING || mode.value === MODE_CLOSE_HERO;
    return {
      left: interpolate(p, [0, 1], [fromRect.value.x, toRect.value.x]),
      top: interpolate(p, [0, 1], [fromRect.value.y, toRect.value.y]),
      width: interpolate(p, [0, 1], [fromRect.value.width, toRect.value.width]),
      height: interpolate(p, [0, 1], [fromRect.value.height, toRect.value.height]),
      borderRadius: interpolate(p, [0, 1], [fading.value ? 0 : TILE_RADIUS, 0]),
      opacity: shown ? (fading.value ? p : 1) : 0,
    };
  });
  const pagerStyle = useAnimatedStyle(() => ({
    opacity:
      mode.value === MODE_OPEN ? 1 : mode.value === MODE_CLOSE_FADE ? progress.value : 0,
  }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: OPEN_MS,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
    timers.current.push(setTimeout(() => setAnimDone(true), OPEN_MS + 40));
    // Safety net: never wait forever for an image that fails to load.
    timers.current.push(setTimeout(() => setLoaded(true), 1500));

    // Photos without known dimensions would otherwise jump when the hero hands over.
    const startItem = items[startIndex];
    if (startItem && startItem.kind !== 'video' && (!startItem.width || !startItem.height)) {
      Image.getSize(
        startItem.uri,
        (w, h) => {
          sizes.current[startIndex] = { w, h };
          toRect.value = fitRect(w, h, width, height);
        },
        () => {},
      );
    }

    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
    // Runs once, when the viewer opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hand over from the flying photo to the pager only when the animation is finished
  // AND the pager's own image is already on screen. This is what removes the glitch.
  useEffect(() => {
    if (phase === 'opening' && animDone && loaded) {
      mode.value = MODE_OPEN;
      setPhase('open');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, animDone, loaded]);

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setMenuOpen(false);
    setReacting(false);
    setPickerOpen(false);
    const backToTile = currentRef.current === startIndex && !!origin;
    mode.value = backToTile ? MODE_CLOSE_HERO : MODE_CLOSE_FADE;
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
      if (overlayOpenRef.current) {
        setMenuOpen(false);
        setReacting(false);
        setPickerOpen(false);
      } else {
        closeRef.current();
      }
      return true;
    });
    return () => subscription.remove();
  }, []);

  const currentItem = items[current];
  const startItem = items[startIndex];
  const reaction = currentItem ? reactions[currentItem.uri] : undefined;

  const pickReaction = (emoji: string) => {
    if (!currentItem) return;
    const uri = currentItem.uri;
    setReactions((previous) => {
      const next = { ...previous };
      if (next[uri] === emoji) delete next[uri];
      else next[uri] = emoji;
      return next;
    });
    setReacting(false);
    setPickerOpen(false);
  };

  const goTo = (index: number) => {
    currentRef.current = index;
    setCurrent(index);
    pagerRef.current?.scrollToIndex({ index, animated: false });
  };

  const saveUris = async (uris: string[]) => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Allow access to your photos to save them.');
        return;
      }
      for (const uri of uris) {
        await MediaLibrary.saveToLibraryAsync(uri);
      }
      Alert.alert('Saved', uris.length === 1 ? 'Saved to your gallery.' : `${uris.length} items saved to your gallery.`);
    } catch {
      Alert.alert('Could not save', 'Something went wrong while saving.');
    }
  };

  const menuItems: MenuItem[] = [
    {
      label: 'Save this photo',
      icon: 'download-outline',
      onPress: () => {
        setMenuOpen(false);
        if (currentItem) void saveUris([currentItem.uri]);
      },
    },
    {
      label: 'Save all',
      icon: 'images-outline',
      onPress: () => {
        setMenuOpen(false);
        void saveUris(items.map((item) => item.uri));
      },
    },
    {
      label: 'Forward',
      icon: 'arrow-redo-outline',
      onPress: () => {
        setMenuOpen(false);
        Alert.alert('Forward', 'Forwarding from the viewer is not connected yet.');
      },
    },
    {
      label: 'Report',
      icon: 'flag-outline',
      destructive: true,
      onPress: () => {
        setMenuOpen(false);
        Alert.alert('Report this photo?', 'We will review it.', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Report',
            style: 'destructive',
            onPress: () => Alert.alert('Thanks', 'Your report has been sent.'),
          },
        ]);
      },
    },
  ];

  const topOffset = insets.top + spacing.sm;
  const buttonBackground = { backgroundColor: colors.scrim };

  return (
    <View style={styles.root}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
      />

      <Animated.View
        style={[StyleSheet.absoluteFill, pagerStyle]}
        pointerEvents={phase === 'open' ? 'auto' : 'none'}
      >
        <FlatList
          ref={pagerRef}
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
                <Pressable
                  accessibilityLabel={item.kind === 'video' ? 'Video' : 'Photo'}
                  onPress={() => {
                    setReacting(false);
                    setMenuOpen(false);
                    setChromeVisible((visible) => !visible);
                  }}
                  style={StyleSheet.absoluteFill}
                >
                  <Image
                    source={{ uri: item.uri }}
                    resizeMode="contain"
                    fadeDuration={0}
                    onLoadEnd={index === startIndex ? () => setLoaded(true) : undefined}
                    style={StyleSheet.absoluteFill}
                  />
                </Pressable>
              )}
            </View>
          )}
        />
      </Animated.View>

      {phase === 'open' && chromeVisible ? (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(120)}
          pointerEvents="box-none"
          style={StyleSheet.absoluteFill}
        >
          <View style={[styles.topBar, { top: topOffset }]} pointerEvents="box-none">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={close}
              style={[styles.button, buttonBackground]}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </Pressable>
            <View style={styles.counterWrap} pointerEvents="none">
              {items.length > 1 ? (
                <View style={[styles.counter, buttonBackground]}>
                  <AppText variant="callout">{`${current + 1} / ${items.length}`}</AppText>
                </View>
              ) : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="More options"
              onPress={() => {
                setReacting(false);
                setMenuOpen((open) => !open);
              }}
              style={[styles.button, buttonBackground]}
            >
              <Ionicons name="ellipsis-horizontal" size={22} color={colors.textPrimary} />
            </Pressable>
          </View>

          {menuOpen ? (
            <>
              <Pressable
                accessibilityLabel="Close menu"
                onPress={() => setMenuOpen(false)}
                style={StyleSheet.absoluteFill}
              />
              <Animated.View
                entering={popIn}
                style={{
                  position: 'absolute',
                  top: topOffset + BUTTON + 6,
                  right: spacing.lg,
                  width: MENU_WIDTH,
                  transformOrigin: 'right top',
                }}
              >
                <MenuCard items={menuItems} />
              </Animated.View>
            </>
          ) : null}

          <View
            style={[styles.bottom, { paddingBottom: insets.bottom + spacing.sm }]}
            pointerEvents="box-none"
          >
            {reacting ? (
              <Animated.View
                entering={popIn}
                style={{ marginBottom: spacing.sm, transformOrigin: 'center bottom' }}
              >
                <ReactionBar
                  selected={reaction}
                  onSelect={pickReaction}
                  onMore={() => {
                    setReacting(false);
                    setPickerOpen(true);
                  }}
                />
              </Animated.View>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="React"
              onPress={() => setReacting((open) => !open)}
              style={[styles.reactButton, buttonBackground]}
            >
              {reaction ? (
                <Text style={styles.reactEmoji}>{reaction}</Text>
              ) : (
                <Ionicons name="happy-outline" size={26} color={colors.textPrimary} />
              )}
            </Pressable>
            {items.length > 1 ? (
              <MediaThumbStrip items={items} current={current} onSelect={goTo} />
            ) : null}
          </View>
        </Animated.View>
      ) : null}

      {pickerOpen ? (
        <EmojiPickerSheet onPick={pickReaction} onClose={() => setPickerOpen(false)} />
      ) : null}

      {startItem ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.hero, { backgroundColor: colors.surface }, heroStyle]}
        >
          <Image
            source={{ uri: startItem.uri }}
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
  topBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: BUTTON,
    height: BUTTON,
    borderRadius: BUTTON / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterWrap: { flex: 1, alignItems: 'center' },
  counter: {
    paddingHorizontal: spacing.md,
    height: BUTTON,
    borderRadius: BUTTON / 2,
    justifyContent: 'center',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  reactButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  reactEmoji: { fontSize: 26, lineHeight: 32, includeFontPadding: false },
});
