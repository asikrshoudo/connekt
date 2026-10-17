import { StyleSheet, View } from 'react-native';
import { avatarPalette } from '../../core/theme/avatarPalette';
import { useColors } from '../../core/theme/ThemeProvider';
import { getInitials } from '../../utils/initials';
import { AppText } from './AppText';

type Props = { name: string; size?: number };

function pickColor(name: string): string {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return avatarPalette[sum % avatarPalette.length] ?? avatarPalette[0];
}

export function Avatar({ name, size = 52 }: Props) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: pickColor(name) },
      ]}
    >
      <AppText
        variant="headline"
        style={{ color: colors.onAccent, fontSize: size * 0.38, lineHeight: size * 0.46 }}
      >
        {getInitials(name)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
});
