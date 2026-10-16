import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../app/theme/colors';
import { Screen } from '../../components/layout/Screen';

// Temporary screen to verify edge-to-edge on a real device.
export function InsetsCheckScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.title}>Connekt</Text>
        <Text style={styles.line}>Edge-to-edge check</Text>
        <Text style={styles.line}>top {insets.top} / bottom {insets.bottom}</Text>
        <Text style={styles.line}>left {insets.left} / right {insets.right}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 8 },
  title: { color: colors.textPrimary, fontSize: 34, fontWeight: '700' },
  line: { color: colors.textSecondary, fontSize: 16 },
});
