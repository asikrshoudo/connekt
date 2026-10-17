import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = {
  children: ReactNode;
  // Set to false when the screen handles the bottom inset itself (e.g. a composer).
  padBottom?: boolean;
};

export function Screen({ children, padBottom = true }: Props) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: padBottom ? insets.bottom : 0,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
