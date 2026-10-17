import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import { PillButton } from '../../components/ui/PillButton';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = { name: string; onUnblock: () => void };

export function BlockedBar({ name, onUnblock }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.surface, paddingBottom: insets.bottom + spacing.md },
      ]}
    >
      <AppText tone="secondary" style={styles.text}>
        {`You blocked ${name}. This is saved on this device only for now.`}
      </AppText>
      <PillButton label="Unblock" variant="subtle" onPress={onUnblock} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.lg, paddingHorizontal: spacing.lg },
  text: { textAlign: 'center' },
});
