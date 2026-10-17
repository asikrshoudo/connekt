import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { VideoPlayerView } from './VideoPlayerView';

type Props = NativeStackScreenProps<RootStackParamList, 'MediaViewer'>;

const VIEWER_BACKGROUND = '#000000';

export function MediaViewerScreen({ route, navigation }: Props) {
  const { uri, kind } = route.params;
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {kind === 'image' ? (
        <Image
          source={{ uri }}
          resizeMode="contain"
          accessibilityLabel="Photo"
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <VideoPlayerView uri={uri} />
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={() => navigation.goBack()}
        style={[styles.close, { top: insets.top + spacing.sm, backgroundColor: colors.scrim }]}
      >
        <Ionicons name="close" size={24} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: VIEWER_BACKGROUND },
  close: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
