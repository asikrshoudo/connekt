import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { radius } from '../../core/theme/radius';
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
  const color = focused ? colors.accent : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={config.label}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.item}
    >
      {({ pressed }) => (
        <View style={[styles.content, pressed && styles.pressed]}>
          <View
            style={[
              styles.iconWrapper,
              focused && {
                backgroundColor: colors.tabIndicator,
              },
            ]}
          >
            <Ionicons
              name={focused ? config.iconFocused : config.icon}
              size={21}
              color={color}
            />
          </View>
          <AppText
            variant="captionSmall"
            numberOfLines={1}
            style={[
              styles.label,
              {
                color,
                fontWeight: focused ? '700' : '500',
              },
            ]}
          >
            {config.label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  content: {
    alignItems: 'center',
    gap: 3,
  },
  iconWrapper: {
    width: 44,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
