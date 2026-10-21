import { StyleSheet, View } from 'react-native';
import { useColors } from '../../core/theme/ThemeProvider';

type Segment = { value: number; color: string };

export function StorageBar({ segments, total }: { segments: Segment[]; total: number }) {
  const colors = useColors();
  const safeTotal = Math.max(total, 1);
  return (
    <View
      accessible
      accessibilityLabel="Storage use"
      style={[styles.track, { backgroundColor: colors.surfaceElevated }]}
    >
      {segments.map((segment, index) => (
        <View
          key={index}
          style={{
            width: `${Math.min(100, (segment.value / safeTotal) * 100)}%`,
            minWidth: segment.value > 0 ? 3 : 0,
            backgroundColor: segment.color,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: 5, overflow: 'hidden', flexDirection: 'row' },
});
