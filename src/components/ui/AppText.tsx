import { Text, type TextProps } from 'react-native';
import type { ColorTokens } from '../../core/theme/colors';
import { useColors } from '../../core/theme/ThemeProvider';
import { typography, type TypographyVariant } from '../../core/theme/typography';

type Tone = 'primary' | 'secondary' | 'muted';

type Props = TextProps & {
  variant?: TypographyVariant;
  tone?: Tone;
};

const toneColor: Record<Tone, keyof ColorTokens> = {
  primary: 'textPrimary',
  secondary: 'textSecondary',
  muted: 'textMuted',
};

export function AppText({ variant = 'body', tone = 'primary', style, ...rest }: Props) {
  const colors = useColors();
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      style={[typography[variant], { color: colors[toneColor[tone]] }, style]}
      {...rest}
    />
  );
}
