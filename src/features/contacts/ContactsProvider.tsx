import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Contact } from '../../types/contact';

type ContactsContextValue = { contacts: Contact[]; isSample: boolean };

const ContactsContext = createContext<ContactsContextValue | null>(null);

type Props = {
  initialContacts: Contact[];
  isSample?: boolean;
  children: ReactNode;
};

export function ContactsProvider({ initialContacts, isSample = false, children }: Props) {
  const value = useMemo(() => ({ contacts: initialContacts, isSample }), [initialContacts, isSample]);
  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
}

export function useContacts(): ContactsContextValue {
  const value = useContext(ContactsContext);
  if (!value) throw new Error('useContacts must be used inside ContactsProvider');
  return value;
}
