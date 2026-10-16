import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '../../components/layout/Screen';
import { AppText } from '../../components/ui/AppText';
import { spacing } from '../../core/theme/spacing';

// Temporary screen to verify edge-to-edge on a real device.
export function InsetsCheckScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Screen>
      <View style={styles.body}>
        <AppText variant="largeTitle">Connekt</AppText>
        <AppText tone="secondary">Edge-to-edge check</AppText>
        <AppText tone="secondary">top {insets.top} / bottom {insets.bottom}</AppText>
        <AppText tone="secondary">left {insets.left} / right {insets.right}</AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, gap: spacing.sm },
});
