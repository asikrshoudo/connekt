import * as Notifications from 'expo-notifications';
import { PermissionsAndroid, Platform, type Permission } from 'react-native';
import type { PermissionId } from './types';

const apiLevel = Number(Platform.Version);
const P = PermissionsAndroid.PERMISSIONS;

type Rule = { permissions: Permission[]; mode: 'all' | 'any' };

function ruleFor(id: Exclude<PermissionId, 'notifications'>): Rule {
  switch (id) {
    case 'media':
      return {
        permissions: apiLevel >= 33 ? [P.READ_MEDIA_IMAGES, P.READ_MEDIA_VIDEO] : [P.READ_EXTERNAL_STORAGE],
        mode: 'all',
      };
    case 'camera':
      return { permissions: [P.CAMERA], mode: 'all' };
    case 'microphone':
      return { permissions: [P.RECORD_AUDIO], mode: 'all' };
    case 'location':
      return { permissions: [P.ACCESS_FINE_LOCATION, P.ACCESS_COARSE_LOCATION], mode: 'any' };
    case 'contacts':
      return { permissions: [P.READ_CONTACTS], mode: 'all' };
  }
}

export async function checkPermission(id: PermissionId): Promise<boolean> {
  if (id === 'notifications') {
    if (apiLevel < 33) return true;
    const result = await Notifications.getPermissionsAsync();
    return result.granted;
  }
  const { permissions, mode } = ruleFor(id);
  const results = await Promise.all(permissions.map((p) => PermissionsAndroid.check(p)));
  return mode === 'all' ? results.every(Boolean) : results.some(Boolean);
}

export async function requestPermission(id: PermissionId): Promise<'granted' | 'denied' | 'blocked'> {
  if (id === 'notifications') {
    if (apiLevel < 33) return 'granted';
    // Android 13+ needs a notification channel before the prompt can appear.
    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    const result = await Notifications.requestPermissionsAsync();
    if (result.granted) return 'granted';
    return result.canAskAgain ? 'denied' : 'blocked';
  }

  const { permissions, mode } = ruleFor(id);
  const results = await PermissionsAndroid.requestMultiple(permissions);
  const values = permissions.map((p) => results[p]);
  const granted =
    mode === 'all'
      ? values.every((v) => v === 'granted')
      : values.some((v) => v === 'granted');
  if (granted) return 'granted';
  return values.some((v) => v === 'never_ask_again') ? 'blocked' : 'denied';
}
