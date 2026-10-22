import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { ID_PATTERN } from '../contacts/contactCard';

// A random label for this install. It is not an account and proves nothing about who you are.
const STORAGE_KEY = 'connekt.identity.v1';

function randomId(): string {
  return Array.from(Crypto.getRandomBytes(16), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function load(): Promise<string> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved && ID_PATTERN.test(saved)) return saved;
  const id = randomId();
  await AsyncStorage.setItem(STORAGE_KEY, id);
  return id;
}

let pending: Promise<string> | null = null;

export function getOrCreateConnektId(): Promise<string> {
  if (!pending) {
    pending = load().catch((error: unknown) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}

// The day Connekt was first opened on this phone, kept on this phone only.
const FIRST_OPENED_KEY = 'connekt.firstOpened.v1';

export async function getFirstOpened(): Promise<number> {
  const saved = Number(await AsyncStorage.getItem(FIRST_OPENED_KEY));
  if (Number.isFinite(saved) && saved > 0) return saved;
  const now = Date.now();
  await AsyncStorage.setItem(FIRST_OPENED_KEY, String(now));
  return now;
}
