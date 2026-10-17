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
  headerRight?: ReactNode;
};

export function TabScreen({ title, children, padForTabBar = true, headerRight }: Props) {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="largeTitle">{title}</AppText>
        {headerRight}
      </View>
      <View style={[styles.content, padForTabBar && styles.clearance]}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  content: { flex: 1 },
  clearance: { paddingBottom: TAB_BAR_CLEARANCE },
});
