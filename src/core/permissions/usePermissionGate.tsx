import { useCallback, useState, type ReactElement } from 'react';
import { Linking } from 'react-native';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { permissionInfo } from './permissionInfo';
import { usePermissions } from './PermissionsProvider';
import type { PermissionId } from './types';

type Pending = { id: PermissionId; resolve: (granted: boolean) => void };

// ensure(id) resolves true if the permission is (or becomes) granted.
// If it is not granted yet, it shows an explanation sheet before the Android dialog.
export function usePermissionGate(): {
  ensure: (id: PermissionId) => Promise<boolean>;
  gate: ReactElement | null;
} {
  const { statuses, request } = usePermissions();
  const [pending, setPending] = useState<Pending | null>(null);

  const ensure = useCallback(
    (id: PermissionId) =>
      new Promise<boolean>((resolve) => {
        if (statuses[id] === 'granted') {
          resolve(true);
          return;
        }
        setPending({ id, resolve });
      }),
    [statuses],
  );

  let gate: ReactElement | null = null;
  if (pending) {
    const { id, resolve } = pending;
    const info = permissionInfo[id];
    const blocked = statuses[id] === 'blocked';
    const finish = (granted: boolean) => {
      setPending(null);
      resolve(granted);
    };

    gate = (
      <ActionSheet
        visible
        title={`Allow ${info.title.toLowerCase()}?`}
        message={
          blocked ? `${info.description} It is turned off in Android settings.` : info.description
        }
        actions={[
          blocked
            ? {
                label: 'Open settings',
                onPress: () => {
                  void Linking.openSettings();
                  finish(false);
                },
              }
            : {
                label: 'Allow',
                onPress: () => {
                  setPending(null);
                  void request(id).then((result) => resolve(result === 'granted'));
                },
              },
        ]}
        cancelLabel="Not now"
        onClose={() => finish(false)}
      />
    );
  }

  return { ensure, gate };
}
