import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import { checkPermission, requestPermission } from './androidPermissions';
import { getNfcStatus, type NfcStatus } from './nfc';
import { PERMISSION_ORDER, type PermissionId, type PermState } from './types';

const INITIAL: Record<PermissionId, PermState> = {
  notifications: 'unknown',
  media: 'unknown',
  camera: 'unknown',
  microphone: 'unknown',
  location: 'unknown',
  contacts: 'unknown',
};

type PermissionsContextValue = {
  statuses: Record<PermissionId, PermState>;
  nfc: NfcStatus;
  request: (id: PermissionId) => Promise<PermState>;
  requestAll: () => Promise<void>;
};

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState(INITIAL);
  const [nfc, setNfc] = useState<NfcStatus>('unsupported');
  // Android only tells us "never ask again" when we ask, so remember it for this session.
  const blocked = useRef(new Set<PermissionId>());

  const refresh = useCallback(async () => {
    const next = { ...INITIAL };
    for (const id of PERMISSION_ORDER) {
      if (await checkPermission(id)) {
        blocked.current.delete(id);
        next[id] = 'granted';
      } else {
        next[id] = blocked.current.has(id) ? 'blocked' : 'denied';
      }
    }
    setStatuses(next);
    setNfc(await getNfcStatus());
  }, []);

  const request = useCallback(async (id: PermissionId): Promise<PermState> => {
    const result = await requestPermission(id);
    if (result === 'blocked') blocked.current.add(id);
    else blocked.current.delete(id);
    setStatuses((previous) => ({ ...previous, [id]: result }));
    return result;
  }, []);

  const requestAll = useCallback(async () => {
    for (const id of PERMISSION_ORDER) {
      if (await checkPermission(id)) continue;
      if (blocked.current.has(id)) continue;
      await request(id);
    }
  }, [request]);

  useEffect(() => {
    void refresh();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  const value = useMemo(
    () => ({ statuses, nfc, request, requestAll }),
    [statuses, nfc, request, requestAll],
  );

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}

export function usePermissions(): PermissionsContextValue {
  const value = useContext(PermissionsContext);
  if (!value) throw new Error('usePermissions must be used inside PermissionsProvider');
  return value;
}
