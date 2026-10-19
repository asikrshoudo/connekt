import qrcode from 'qrcode-generator';
import { useMemo } from 'react';
import { View } from 'react-native';

const QUIET_ZONE = 4;
// Always black on white, in every theme, so cameras can read it.
const DARK = '#000000';
const LIGHT = '#FFFFFF';

type Run = { row: number; start: number; length: number };

function buildRuns(value: string): { count: number; runs: Run[] } {
  const qr = qrcode(0, 'M');
  qr.addData(value);
  qr.make();
  const count = qr.getModuleCount();
  const runs: Run[] = [];
  for (let row = 0; row < count; row += 1) {
    let start = -1;
    for (let col = 0; col <= count; col += 1) {
      const dark = col < count && qr.isDark(row, col);
      if (dark && start < 0) start = col;
      if (!dark && start >= 0) {
        runs.push({ row, start, length: col - start });
        start = -1;
      }
    }
  }
  return { count, runs };
}

type Props = { value: string; size?: number };

export function QrCode({ value, size = 240 }: Props) {
  const { count, runs } = useMemo(() => buildRuns(value), [value]);
  const total = count + QUIET_ZONE * 2;
  const cell = Math.max(1, Math.floor(size / total));
  const side = cell * total;

  return (
    <View
      accessible
      accessibilityLabel="QR code"
      style={{ width: side, height: side, backgroundColor: LIGHT, borderRadius: 12 }}
    >
      {runs.map((run) => (
        <View
          key={`${run.row}-${run.start}`}
          style={{
            position: 'absolute',
            left: (run.start + QUIET_ZONE) * cell,
            top: (run.row + QUIET_ZONE) * cell,
            width: run.length * cell,
            height: cell,
            backgroundColor: DARK,
          }}
        />
      ))}
    </View>
  );
}
