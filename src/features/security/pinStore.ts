import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { lockoutDelayMs } from './lockLogic';

// The PIN is never stored as typed. Only a salted hash goes into secure storage.
const PIN_KEY = 'connekt.pin.v1';
const ATTEMPTS_KEY = 'connekt.pin.attempts.v1';

type StoredPin = { salt: string; hash: string };
export type Attempts = { failed: number; lockedUntil: number };

const NO_ATTEMPTS: Attempts = { failed: 0, lockedUntil: 0 };

function randomHex(bytes: number): string {
  return Array.from(Crypto.getRandomBytes(bytes), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

function hashPin(pin: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);
}

function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return difference === 0;
}

async function readStored(): Promise<StoredPin | null> {
  const raw = await SecureStore.getItemAsync(PIN_KEY);
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return null;
    const record = value as Record<string, unknown>;
    if (typeof record.salt !== 'string' || typeof record.hash !== 'string') return null;
    return { salt: record.salt, hash: record.hash };
  } catch {
    return null;
  }
}

export async function hasPin(): Promise<boolean> {
  return (await readStored()) !== null;
}

export async function savePin(pin: string): Promise<void> {
  const salt = randomHex(16);
  const hash = await hashPin(pin, salt);
  await SecureStore.setItemAsync(PIN_KEY, JSON.stringify({ salt, hash }));
  await resetAttempts();
}

export async function checkPin(pin: string): Promise<boolean> {
  const stored = await readStored();
  if (!stored) return false;
  return sameText(await hashPin(pin, stored.salt), stored.hash);
}

export async function removePin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
  await resetAttempts();
}

export async function readAttempts(): Promise<Attempts> {
  const raw = await SecureStore.getItemAsync(ATTEMPTS_KEY);
  if (!raw) return NO_ATTEMPTS;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return NO_ATTEMPTS;
    const record = value as Record<string, unknown>;
    return {
      failed: typeof record.failed === 'number' ? record.failed : 0,
      lockedUntil: typeof record.lockedUntil === 'number' ? record.lockedUntil : 0,
    };
  } catch {
    return NO_ATTEMPTS;
  }
}

export async function recordFailure(now: number): Promise<Attempts> {
  const current = await readAttempts();
  const failed = current.failed + 1;
  const delay = lockoutDelayMs(failed);
  const next: Attempts = { failed, lockedUntil: delay > 0 ? now + delay : 0 };
  await SecureStore.setItemAsync(ATTEMPTS_KEY, JSON.stringify(next));
  return next;
}

export async function resetAttempts(): Promise<void> {
  await SecureStore.deleteItemAsync(ATTEMPTS_KEY);
}
