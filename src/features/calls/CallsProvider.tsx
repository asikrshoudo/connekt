import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { CallRecord } from '../../types/call';

type CallsContextValue = { calls: CallRecord[]; isSample: boolean };

const CallsContext = createContext<CallsContextValue | null>(null);

type Props = {
  initialCalls: CallRecord[];
  isSample?: boolean;
  children: ReactNode;
};

export function CallsProvider({ initialCalls, isSample = false, children }: Props) {
  const value = useMemo(() => ({ calls: initialCalls, isSample }), [initialCalls, isSample]);
  return <CallsContext.Provider value={value}>{children}</CallsContext.Provider>;
}

export function useCalls(): CallsContextValue {
  const value = useContext(CallsContext);
  if (!value) throw new Error('useCalls must be used inside CallsProvider');
  return value;
}
