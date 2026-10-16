import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spring } from '../../core/theme/motion';
import { radius } from '../../core/theme/radius';
import { useColors } from '../../core/theme/ThemeProvider';
import { TabBarItem } from './TabBarItem';
import { TAB_BAR_GAP, TAB_BAR_HEIGHT } from './tabBarMetrics';
import { tabConfig } from './tabConfig';

const PADDING = 6;

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [barWidth, setBarWidth] = useState(0);
  const x = useSharedValue(0);
  const itemWidth = barWidth > 0 ? (barWidth - PADDING * 2) / state.routes.length : 0;

  useEffect(() => {
    x.value = withSpring(state.index * itemWidth, {
      ...spring.snappy,
      reduceMotion: ReduceMotion.System,
    });
  }, [state.index, itemWidth, x]);

  const indicatorStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const onLayout = (event: LayoutChangeEvent) => setBarWidth(event.nativeEvent.layout.width);

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom: insets.bottom + TAB_BAR_GAP }]}>
      <View
        onLayout={onLayout}
        style={[styles.bar, { backgroundColor: colors.tabBar, borderColor: colors.border }]}
      >
        {itemWidth > 0 && (
          <Animated.View
            style={[
              styles.indicator,
              { width: itemWidth, backgroundColor: colors.tabIndicator },
              indicatorStyle,
            ]}
          />
        )}
        {state.routes.map((route, index) => {
          const config = tabConfig[route.name];
          if (!config) return null;
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <TabBarItem
              key={route.key}
              config={config}
              focused={focused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  bar: {
    width: '86%',
    maxWidth: 360,
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    padding: PADDING,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  indicator: {
    position: 'absolute',
    left: PADDING,
    top: PADDING,
    bottom: PADDING,
    borderRadius: radius.pill,
  },
});
