import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView } from 'expo-camera';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { PillButton } from '../../components/ui/PillButton';
import type { RootStackParamList } from '../../core/navigation/types';
import { usePermissions } from '../../core/permissions/PermissionsProvider';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { DarkScope, useColors } from '../../core/theme/ThemeProvider';
import { useContactCardHost } from '../contacts/ContactCardHost';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

function ScanCamera({ onBack }: { onBack: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { handle } = useContactCardHost();
  const [paused, setPaused] = useState(false);

  const onScanned = (data: string) => {
    setPaused(true);
    handle(data, () => setPaused(false));
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={paused ? undefined : (result) => onScanned(result.data)}
      />
      <View pointerEvents="none" style={styles.frameWrap}>
        <View style={[styles.frame, { borderColor: colors.accent }]}>
          <View style={[styles.corner, styles.cornerTL, { borderColor: colors.accent }]} />
          <View style={[styles.corner, styles.cornerTR, { borderColor: colors.accent }]} />
          <View style={[styles.corner, styles.cornerBL, { borderColor: colors.accent }]} />
          <View style={[styles.corner, styles.cornerBR, { borderColor: colors.accent }]} />
        </View>
        <View style={[styles.hintPill, { backgroundColor: colors.scrim }]}>
          <AppText variant="footnote" style={{ color: '#ffffff', fontWeight: '600' }}>
            Scan a Myth contact QR code
          </AppText>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        style={[styles.back, { top: insets.top + spacing.sm, backgroundColor: colors.scrim }]}
      >
        <Ionicons name="chevron-back" size={22} color="#ffffff" />
      </Pressable>
    </View>
  );
}

export function ScanScreen({ navigation }: Props) {
  const colors = useColors();
  const { statuses, request } = usePermissions();

  if (statuses.camera !== 'granted') {
    const blocked = statuses.camera === 'blocked';
    return (
      <Screen>
        <ScreenHeader title="Scan QR Code" onBack={() => navigation.goBack()} />
        <View style={styles.explainer}>
          <View style={[styles.iconBox, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="scan-outline" size={36} color={colors.accent} />
          </View>
          <AppText variant="heading">Camera Permission</AppText>
          <AppText tone="secondary" style={styles.center}>
            Myth uses camera access strictly for scanning contact QR codes. No media is stored or transmitted externally.
          </AppText>
          <PillButton
            size="large"
            label={blocked ? 'Open phone settings' : 'Grant camera access'}
            onPress={() => (blocked ? void Linking.openSettings() : void request('camera'))}
          />
        </View>
      </Screen>
    );
  }

  return (
    <DarkScope>
      <ScanCamera onBack={() => navigation.goBack()} />
    </DarkScope>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  explainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  center: { textAlign: 'center', maxWidth: 300, lineHeight: 20 },
  frameWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  frame: {
    width: 240,
    height: 240,
    borderRadius: radius.xl,
    borderWidth: 1,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: radius.md,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: radius.md,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: radius.md,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: radius.md,
  },
  hintPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  back: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
