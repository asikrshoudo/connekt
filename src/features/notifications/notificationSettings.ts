export type NotificationSettings = {
  messages: boolean;
  groups: boolean;
  requests: boolean;
  reactions: boolean;
  showPreview: boolean;
  sound: boolean;
  vibrate: boolean;
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  messages: true,
  groups: true,
  requests: true,
  reactions: false,
  showPreview: true,
  sound: true,
  vibrate: true,
};

// Reads saved settings. Anything missing or broken falls back to the defaults.
export function parseNotificationSettings(raw: string | null): NotificationSettings {
  if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return DEFAULT_NOTIFICATION_SETTINGS;
    const record = value as Record<string, unknown>;
    const read = (key: keyof NotificationSettings): boolean => {
      const saved = record[key];
      return typeof saved === 'boolean' ? saved : DEFAULT_NOTIFICATION_SETTINGS[key];
    };
    return {
      messages: read('messages'),
      groups: read('groups'),
      requests: read('requests'),
      reactions: read('reactions'),
      showPreview: read('showPreview'),
      sound: read('sound'),
      vibrate: read('vibrate'),
    };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export type NotificationEvent = {
  kind: 'message' | 'group' | 'request' | 'reaction';
  muted: boolean;
  restricted: boolean;
  blocked: boolean;
};

// Decides if an event should make a notification. Nothing calls this yet, because
// Connekt has no server to deliver messages. It is ready for when that exists.
export function shouldNotify(settings: NotificationSettings, event: NotificationEvent): boolean {
  if (event.blocked || event.restricted || event.muted) return false;
  switch (event.kind) {
    case 'message':
      return settings.messages;
    case 'group':
      return settings.groups;
    case 'request':
      return settings.requests;
    case 'reaction':
      return settings.reactions;
  }
}
