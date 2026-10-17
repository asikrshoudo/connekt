import { Children, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from './AppText';
import { SectionHeader } from './SectionHeader';

type Props = {
  title?: string;
  footer?: string;
  children: ReactNode;
};

export function SettingsSection({ title, footer, children }: Props) {
  const colors = useColors();
  const rows = Children.toArray(children);

  return (
    <View>
      {title ? <SectionHeader title={title} /> : null}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {rows.map((row, index) => (
          <View key={index}>
            {index > 0 ? (
              <View style={[styles.separator, { backgroundColor: colors.border }]} />
            ) : null}
            {row}
          </View>
        ))}
      </View>
      {footer ? (
        <AppText variant="footnote" tone="muted" style={styles.footer}>
          {footer}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: spacing.lg, borderRadius: radius.lg, overflow: 'hidden' },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 58 },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
});
