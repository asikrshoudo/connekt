import { Easing, Keyframe } from 'react-native-reanimated';

// Small scale-and-fade entrance for popup menus.
export const popIn = new Keyframe({
  from: { opacity: 0, transform: [{ scale: 0.88 }] },
  to: { opacity: 1, transform: [{ scale: 1 }], easing: Easing.out(Easing.cubic) },
}).duration(180);
