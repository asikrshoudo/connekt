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
import { Linking } from 'react-native';
import { ActionSheet, type SheetAction } from '../../components/feedback/ActionSheet';
import { navigationRef } from '../../core/navigation/navigationRef';
import { useChats } from '../chats/ChatsProvider';
import { getOrCreateConnektId } from '../profile/identity';
import { parseContactCard, type ContactCard } from './contactCard';
import { useContacts } from './ContactsProvider';

const MAX_PREVIEW = 120;

type Outcome =
  | { kind: 'confirm'; card: ContactCard }
  | { kind: 'added'; card: ContactCard }
  | { kind: 'exists'; card: ContactCard }
  | { kind: 'own' }
  | { kind: 'invalid'; preview: string };

type Sheet = {
  title: string;
  message?: string;
  actions: SheetAction[];
  cancelLabel?: string;
};

type HostValue = { handle: (text: string, onDone?: () => void) => void };

const HostContext = createContext<HostValue | null>(null);

export function ContactCardHost({ children }: { children: ReactNode }) {
  const { addContact, hasContact } = useContacts();
  const { startChat } = useChats();
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const doneRef = useRef<(() => void) | null>(null);

  const close = () => {
    setOutcome(null);
    const done = doneRef.current;
    doneRef.current = null;
    done?.();
  };

  // text is a scanned QR code or an opened link. It is only read, never opened.
  const handle = useCallback(
    (text: string, onDone?: () => void) => {
      doneRef.current = onDone ?? null;
      const card = parseContactCard(text);
      if (!card) {
        const preview = text.length > MAX_PREVIEW ? `${text.slice(0, MAX_PREVIEW)}...` : text;
        setOutcome({ kind: 'invalid', preview });
        return;
      }
      getOrCreateConnektId()
        .then((ownId) => {
          if (card.id === ownId) setOutcome({ kind: 'own' });
          else if (hasContact(card.id)) setOutcome({ kind: 'exists', card });
          else setOutcome({ kind: 'confirm', card });
        })
        .catch(() => setOutcome({ kind: 'invalid', preview: '' }));
    },
    [hasContact],
  );

  const handleRef = useRef(handle);
  handleRef.current = handle;

  useEffect(() => {
    const open = (url: string | null | undefined) => {
      if (url && url.startsWith('connekt://')) handleRef.current(url);
    };
    Linking.getInitialURL()
      .then(open)
      .catch(() => undefined);
    const subscription = Linking.addEventListener('url', (event) => open(event.url));
    return () => subscription.remove();
  }, []);

  const openChat = (card: ContactCard) => {
    startChat(card.id, card.name);
    close();
    if (navigationRef.isReady()) {
      navigationRef.navigate('Conversation', { conversationId: card.id });
    }
  };

  const sheetFor = (value: Outcome): Sheet => {
    switch (value.kind) {
      case 'confirm':
        return {
          title: `Add ${value.card.name}?`,
          message:
            'They will be saved on this device. Messages cannot be sent yet, because Connekt has no server.',
          actions: [
            {
              label: 'Add contact',
              onPress: () => setOutcome({ kind: addContact(value.card), card: value.card }),
            },
          ],
        };
      case 'added':
        return {
          title: 'Contact added',
          message: `${value.card.name} is in your contacts.`,
          actions: [{ label: 'Open chat', onPress: () => openChat(value.card) }],
          cancelLabel: 'Done',
        };
      case 'exists':
        return {
          title: 'Already in your contacts',
          message: value.card.name,
          actions: [{ label: 'Open chat', onPress: () => openChat(value.card) }],
          cancelLabel: 'Done',
        };
      case 'own':
        return {
          title: 'This is your own code',
          message: 'Show it to a friend so they can scan it.',
          actions: [],
          cancelLabel: 'OK',
        };
      case 'invalid':
        return {
          title: 'Not a Connekt code',
          message: `This is not a Connekt contact. Nothing was opened.${value.preview ? `\n\n${value.preview}` : ''}`,
          actions: [],
          cancelLabel: 'OK',
        };
    }
  };

  const sheet = outcome ? sheetFor(outcome) : null;
  const value = useMemo(() => ({ handle }), [handle]);

  return (
    <HostContext.Provider value={value}>
      {children}
      <ActionSheet
        visible={sheet !== null}
        title={sheet?.title}
        message={sheet?.message}
        actions={sheet?.actions ?? []}
        cancelLabel={sheet?.cancelLabel}
        onClose={close}
      />
    </HostContext.Provider>
  );
}

export function useContactCardHost(): HostValue {
  const value = useContext(HostContext);
  if (!value) throw new Error('useContactCardHost must be used inside ContactCardHost');
  return value;
}
