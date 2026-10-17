import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraView } from 'expo-camera';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { PillButton } from '../../components/ui/PillButton';
import type { RootStackParamList } from '../../core/navigation/types';
import { usePermissions } from '../../core/permissions/PermissionsProvider';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

const MAX_PREVIEW = 120;

export function ScanScreen({ navigation }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { statuses, request } = usePermissions();
  const [scanned, setScanned] = useState<string | null>(null);

  if (statuses.camera !== 'granted') {
    const blocked = statuses.camera === 'blocked';
    return (
      <Screen>
        <ScreenHeader title="Scan QR code" onBack={() => navigation.goBack()} />
        <View style={styles.explainer}>
          <Ionicons name="scan-outline" size={56} color={colors.textMuted} />
          <AppText variant="heading">Camera access</AppText>
          <AppText tone="secondary" style={styles.center}>
            Connekt uses the camera only to scan QR codes. Nothing is recorded or uploaded.
          </AppText>
          <PillButton
            size="large"
            label={blocked ? 'Open settings' : 'Allow camera'}
            onPress={() => (blocked ? void Linking.openSettings() : void request('camera'))}
          />
        </View>
      </Screen>
    );
  }

  const preview =
    scanned && scanned.length > MAX_PREVIEW ? `${scanned.slice(0, MAX_PREVIEW)}...` : scanned;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : (result) => setScanned(result.data)}
      />
      <View pointerEvents="none" style={styles.frameWrap}>
        <View style={[styles.frame, { borderColor: colors.textPrimary }]} />
        <AppText style={styles.hint}>Point the camera at a QR code</AppText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => navigation.goBack()}
        style={[styles.back, { top: insets.top + spacing.sm, backgroundColor: colors.scrim }]}
      >
        <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
      </Pressable>

      <ActionSheet
        visible={scanned !== null}
        title="QR code scanned"
        message={`${preview ?? ''}\n\nAdding contacts needs an account, which Connekt does not have yet.`}
        actions={[]}
        cancelLabel="Scan again"
        onClose={() => setScanned(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  explainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  center: { textAlign: 'center' },
  frameWrap: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  frame: { width: 240, height: 240, borderWidth: 3, borderRadius: 24 },
  hint: { textAlign: 'center' },
  back: { position: 'absolute', left: spacing.lg, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
