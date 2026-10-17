import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet } from 'react-native';

export function VideoPlayerView({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (instance) => {
    instance.play();
  });
  return (
    <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="contain" nativeControls />
  );
}
