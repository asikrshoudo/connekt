import { BlurView } from 'expo-blur';
import type { ComponentRef, RefObject } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MENU_ROW_HEIGHT,
  MENU_WIDTH,
  MenuCard,
  type MenuItem,
} from '../../components/feedback/MenuCard';
import { popIn } from '../../components/feedback/popKeyframe';
import { useColors, useThemeSettings } from '../../core/theme/ThemeProvider';
import { MessageBody } from './MessageBody';
import { REACTION_BAR_HEIGHT, REACTION_BAR_WIDTH, ReactionBar } from './ReactionBar';
import type { MessageMenuTarget } from './types';

const MARGIN = 12;
const GAP = 10;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

type Props = {
  target: MessageMenuTarget;
  blurTarget: RefObject<ComponentRef<typeof View> | null>;
  onClose: () => void;
  onReact: (emoji: string) => void;
  onReply: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

export function MessageMenuOverlay({
  target,
  blurTarget,
  onClose,
  onReact,
  onReply,
  onCopy,
  onDelete,
}: Props) {
  const colors = useColors();
  const { isDark } = useThemeSettings();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { message, rect, reply } = target;
  const alignRight = message.direction === 'outgoing';

  const hasText = message.text.length > 0;
  const menuItems: MenuItem[] = [{ label: 'Reply', icon: 'arrow-undo-outline', onPress: onReply }];
  if (hasText) menuItems.push({ label: 'Copy', icon: 'copy-outline', onPress: onCopy });
  menuItems.push({ label: 'Delete', icon: 'trash-outline', onPress: onDelete, destructive: true });
  const menuHeight = MENU_ROW_HEIGHT * menuItems.length;
  const minTop = insets.top + MARGIN + REACTION_BAR_HEIGHT + GAP;
  const maxBottom = screenHeight - insets.bottom - MARGIN - menuHeight - GAP;
  const previewHeight = Math.min(rect.height, Math.max(60, maxBottom - minTop));
  const top = clamp(rect.y, minTop, maxBottom - previewHeight);

  const barLeft = clamp(
    alignRight ? rect.x + rect.width - REACTION_BAR_WIDTH : rect.x,
    MARGIN,
    screenWidth - MARGIN - REACTION_BAR_WIDTH,
  );
  const menuLeft = clamp(
    alignRight ? rect.x + rect.width - MENU_WIDTH : rect.x,
    MARGIN,
    screenWidth - MARGIN - MENU_WIDTH,
  );

  return (
    <Animated.View
      entering={FadeIn.duration(160)}
      exiting={FadeOut.duration(120)}
      style={StyleSheet.absoluteFill}
    >
      <BlurView
        blurTarget={blurTarget}
        intensity={40}
        tint={isDark ? 'dark' : 'light'}
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
      <Pressable
        accessibilityLabel="Close menu"
        onPress={onClose}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
      />

      <Animated.View
        entering={popIn}
        style={[
          styles.abs,
          {
            top: top - GAP - REACTION_BAR_HEIGHT,
            left: barLeft,
            transformOrigin: alignRight ? 'right bottom' : 'left bottom',
          },
        ]}
      >
        <ReactionBar selected={message.reaction} onSelect={onReact} />
      </Animated.View>

      <View
        pointerEvents="none"
        style={[
          styles.abs,
          { top, left: rect.x, width: rect.width, height: previewHeight, overflow: 'hidden' },
        ]}
      >
        <MessageBody message={message} reply={reply} />
      </View>

      <Animated.View
        entering={popIn}
        style={[
          styles.abs,
          {
            top: top + previewHeight + GAP,
            left: menuLeft,
            transformOrigin: alignRight ? 'right top' : 'left top',
          },
        ]}
      >
        <MenuCard items={menuItems} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  abs: { position: 'absolute' },
});
