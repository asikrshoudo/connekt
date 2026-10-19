import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Contact } from '../../types/contact';
import type { ContactCard } from './contactCard';
import { parseSavedContacts } from './savedContacts';

// Stored on this device only: the names and random ids of contacts you added.
const STORAGE_KEY = 'connekt.contacts.v1';

type ContactsContextValue = {
  contacts: Contact[];
  isSample: boolean;
  hasContact: (id: string) => boolean;
  addContact: (card: ContactCard) => 'added' | 'exists';
};

const ContactsContext = createContext<ContactsContextValue | null>(null);

type Props = {
  initialContacts: Contact[];
  isSample?: boolean;
  children: ReactNode;
};

export function ContactsProvider({ initialContacts, isSample = false, children }: Props) {
  const [saved, setSaved] = useState<Contact[]>([]);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (active) setSaved(parseSavedContacts(raw));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const hasContact = useCallback((id: string) => saved.some((c) => c.id === id), [saved]);

  const addContact = useCallback(
    (card: ContactCard): 'added' | 'exists' => {
      if (saved.some((c) => c.id === card.id)) return 'exists';
      const next = [...saved, { id: card.id, name: card.name }];
      setSaved(next);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
      return 'added';
    },
    [saved],
  );

  const contacts = useMemo(
    () => [...saved, ...initialContacts].sort((a, b) => a.name.localeCompare(b.name)),
    [saved, initialContacts],
  );

  const value = useMemo(
    () => ({ contacts, isSample, hasContact, addContact }),
    [contacts, isSample, hasContact, addContact],
  );

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
}

export function useContacts(): ContactsContextValue {
  const value = useContext(ContactsContext);
  if (!value) throw new Error('useContacts must be used inside ContactsProvider');
  return value;
}
