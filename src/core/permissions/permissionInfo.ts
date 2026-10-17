import type { IconName } from '../../components/ui/iconTypes';
import type { PermissionId } from './types';

type Info = { title: string; description: string; icon: IconName };

export const permissionInfo: Record<PermissionId, Info> = {
  notifications: {
    title: 'Notifications',
    description: 'Get alerts for new messages. Not active yet, it needs a server.',
    icon: 'notifications-outline',
  },
  media: {
    title: 'Photos and videos',
    description: 'Show your recent photos and videos when you attach one.',
    icon: 'images-outline',
  },
  camera: {
    title: 'Camera',
    description: 'Scan QR codes and take photos.',
    icon: 'camera-outline',
  },
  microphone: {
    title: 'Microphone',
    description: 'Record voice messages.',
    icon: 'mic-outline',
  },
  location: {
    title: 'Location',
    description: 'Share where you are in a chat, only when you choose to.',
    icon: 'location-outline',
  },
  contacts: {
    title: 'Contacts',
    description: 'Find people you know. Your contacts stay on your phone.',
    icon: 'people-outline',
  },
};
