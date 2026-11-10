import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { avatarPalette } from '../../core/theme/avatarPalette';
import { useColors } from '../../core/theme/ThemeProvider';
import { getInitials } from '../../utils/initials';
import { AppText } from './AppText';

export type PresenceStatus = 'online' | 'away' | 'offline';

type Props = {
  name: string;
  size?: number;
  group?: boolean;
  uri?: string | null;
  presence?: PresenceStatus | null;
  style?: StyleProp<ViewStyle>;
};

function pickColor(name: string): string {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return avatarPalette[sum % avatarPalette.length] ?? avatarPalette[0];
}

export function Avatar({ name, size = 48, group = false, uri, presence, style }: Props) {
  const colors = useColors();
  const [failedUri, setFailedUri] = useState<string | null>(null);

  const showImage = Boolean(uri && failedUri !== uri);
  const bgColor = pickColor(name);
  const indicatorSize = Math.max(10, Math.round(size * 0.26));
  const indicatorBorder = Math.max(2, Math.round(size * 0.05));

  const presenceColor =
    presence === 'online'
      ? colors.presenceOnline
      : presence === 'away'
      ? colors.presenceAway
      : colors.presenceOffline;

  return (
    <View style={[{ width: size, height: size }, style]}>
      {showImage ? (
        <Image
          source={{ uri: uri! }}
          onError={() => setFailedUri(uri!)}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: Math.round(size * 0.32),
              borderColor: colors.cardBorder,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.container,
            {
              width: size,
              height: size,
              borderRadius: Math.round(size * 0.32),
              backgroundColor: group ? colors.surfaceContainerHigh : bgColor,
              borderColor: group ? colors.cardBorder : 'transparent',
              borderWidth: group ? 1 : 0,
            },
          ]}
        >
          {group ? (
            <Ionicons name="people" size={Math.round(size * 0.48)} color={colors.accent} />
          ) : (
            <AppText
              variant="headline"
              style={{
                color: colors.onAccent,
                fontSize: Math.round(size * 0.38),
                lineHeight: Math.round(size * 0.46),
                fontWeight: '700',
              }}
            >
              {getInitials(name)}
            </AppText>
          )}
        </View>
      )}

      {presence ? (
        <View
          style={[
            styles.presenceBadge,
            {
              width: indicatorSize,
              height: indicatorSize,
              borderRadius: indicatorSize / 2,
              backgroundColor: presenceColor,
              borderColor: colors.background,
              borderWidth: indicatorBorder,
              right: -1,
              bottom: -1,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  presenceBadge: {
    position: 'absolute',
  },
});
