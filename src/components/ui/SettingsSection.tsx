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
    <View style={styles.container}>
      {title ? <SectionHeader title={title} /> : null}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.cardBorder,
          },
        ]}
      >
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
  container: {
    marginBottom: spacing.md,
  },
  card: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 56,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    lineHeight: 18,
  },
});
