// SAMPLE DATA ONLY. These are not real calls.
import type { CallRecord } from '../../types/call';

const DAY = 60 * 24;
const ago = (minutes: number) => Date.now() - minutes * 60_000;

export const sampleCalls: CallRecord[] = [
  { id: 'call-1', conversationId: 'sample-1', direction: 'incoming', kind: 'voice', missed: false, at: ago(25) },
  { id: 'call-2', conversationId: 'sample-4', direction: 'incoming', kind: 'voice', missed: true, at: ago(60 * 7 + 10) },
  { id: 'call-3', conversationId: 'sample-2', direction: 'outgoing', kind: 'video', missed: false, at: ago(60 * 28) },
  { id: 'call-4', conversationId: 'sample-3', direction: 'incoming', kind: 'video', missed: true, at: ago(DAY * 2) },
  { id: 'call-5', conversationId: 'sample-5', direction: 'outgoing', kind: 'voice', missed: false, at: ago(DAY * 3 + 120) },
  { id: 'call-6', conversationId: 'sample-6', direction: 'incoming', kind: 'voice', missed: true, at: ago(DAY * 8) },
  { id: 'call-7', conversationId: 'sample-7', direction: 'outgoing', kind: 'voice', missed: false, at: ago(DAY * 20) },
];
