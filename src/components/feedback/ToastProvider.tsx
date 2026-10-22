import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from '../ui/AppText';

const SHOW_MS = 2200;

type ToastValue = { show: (text: string) => void };

const ToastContext = createContext<ToastValue>({ show: () => undefined });

export function ToastProvider({ children }: { children: ReactNode }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setText(message);
    timer.current = setTimeout(() => setText(null), SHOW_MS);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {text ? (
        <View pointerEvents="none" style={[styles.wrap, { top: insets.top + spacing.md }]}>
          <Animated.View
            entering={FadeIn.duration(160)}
            exiting={FadeOut.duration(200)}
            accessibilityLiveRegion="polite"
            style={[styles.toast, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
          >
            <AppText variant="callout">{text}</AppText>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastValue {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  toast: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 10,
  },
});
