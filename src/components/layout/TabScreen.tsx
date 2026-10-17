import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import { TAB_BAR_CLEARANCE } from '../navigation/tabBarMetrics';
import { AppText } from '../ui/AppText';
import { Screen } from './Screen';

type Props = {
  title: string;
  children: ReactNode;
  // Set to false for scrolling lists that handle their own bottom padding.
  padForTabBar?: boolean;
};

export function TabScreen({ title, children, padForTabBar = true }: Props) {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="largeTitle">{title}</AppText>
      </View>
      <View style={[styles.content, padForTabBar && styles.clearance]}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  content: { flex: 1 },
  clearance: { paddingBottom: TAB_BAR_CLEARANCE },
});
