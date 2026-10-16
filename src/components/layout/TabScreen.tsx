import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import { TAB_BAR_CLEARANCE } from '../navigation/tabBarMetrics';
import { AppText } from '../ui/AppText';
import { Screen } from './Screen';

type Props = { title: string; children: ReactNode };

export function TabScreen({ title, children }: Props) {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="largeTitle">{title}</AppText>
      </View>
      <View style={styles.content}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  content: { flex: 1, paddingBottom: TAB_BAR_CLEARANCE },
});
