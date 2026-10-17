export type NfcStatus = 'unsupported' | 'disabled' | 'enabled';

// Any failure (no NFC chip, module problem) counts as unsupported, so the UI hides NFC.
export async function getNfcStatus(): Promise<NfcStatus> {
  try {
    const { default: NfcManager } = await import('react-native-nfc-manager');
    const supported = await NfcManager.isSupported();
    if (!supported) return 'unsupported';
    const enabled = await NfcManager.isEnabled();
    return enabled ? 'enabled' : 'disabled';
  } catch {
    return 'unsupported';
  }
}
