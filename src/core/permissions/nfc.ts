export type NfcStatus = 'unsupported' | 'disabled' | 'enabled';

// NFC is deferred until the app has a development build and a real NFC feature.
export async function getNfcStatus(): Promise<NfcStatus> {
  return 'unsupported';
}
