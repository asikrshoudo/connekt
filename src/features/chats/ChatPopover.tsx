import { Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MENU_ROW_HEIGHT,
  MENU_WIDTH,
  MenuCard,
  type MenuItem,
} from '../../components/feedback/MenuCard';
import { popIn } from '../../components/feedback/popKeyframe';

const MARGIN = 12;
const OFFSET = 8;

type Props = {
  visible: boolean;
  point: { x: number; y: number };
  items: MenuItem[];
  onClose: () => void;
};

// A small menu that opens next to the finger. No blur and no dimming.
export function ChatPopover({ visible, point, items, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const menuHeight = MENU_ROW_HEIGHT * items.length;
  const fitsBelow = point.y + OFFSET + menuHeight <= screenHeight - insets.bottom - MARGIN;
  const top = fitsBelow
    ? point.y + OFFSET
    : Math.max(insets.top + MARGIN, point.y - OFFSET - menuHeight);
  const left = Math.min(
    Math.max(point.x - MENU_WIDTH / 2, MARGIN),
    Math.max(MARGIN, screenWidth - MARGIN - MENU_WIDTH),
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityLabel="Close menu"
        onPress={onClose}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        entering={popIn}
        style={[
          styles.menu,
          { top, left, transformOrigin: fitsBelow ? 'center top' : 'center bottom' },
        ]}
      >
        <MenuCard items={items} />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: { position: 'absolute' },
});
