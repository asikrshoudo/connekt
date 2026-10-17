export type PermissionId =
  | 'notifications'
  | 'media'
  | 'camera'
  | 'microphone'
  | 'location'
  | 'contacts';

export type PermState = 'granted' | 'denied' | 'blocked' | 'unknown';

export const PERMISSION_ORDER: PermissionId[] = [
  'notifications',
  'media',
  'camera',
  'microphone',
  'location',
  'contacts',
];
