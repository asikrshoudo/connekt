import { Platform } from 'react-native';
import { formatDeviceName } from './deviceFormat';

export type DeviceInfo = { name: string; androidVersion: string };

export function readDeviceInfo(): DeviceInfo {
  if (Platform.OS !== 'android') return { name: 'This phone', androidVersion: '' };
  const constants = Platform.constants;
  return {
    name: formatDeviceName(constants.Brand ?? '', constants.Model ?? ''),
    androidVersion: constants.Release ?? '',
  };
}
