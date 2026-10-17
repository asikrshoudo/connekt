import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigation } from './src/core/navigation/AppNavigation';
import { PermissionsProvider } from './src/core/permissions/PermissionsProvider';
import { ThemeProvider } from './src/core/theme/ThemeProvider';
import { sampleCalls } from './src/data/sample/sampleCalls';
import { sampleContacts } from './src/data/sample/sampleContacts';
import { sampleConversations, samplePinnedIds } from './src/data/sample/sampleConversations';
import { sampleMessages } from './src/data/sample/sampleMessages';
import { CallsProvider } from './src/features/calls/CallsProvider';
import { ChatsProvider } from './src/features/chats/ChatsProvider';
import { ContactsProvider } from './src/features/contacts/ContactsProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <ThemeProvider>
          <PermissionsProvider>
            <ChatsProvider
              initialConversations={sampleConversations}
              initialMessages={sampleMessages}
              initialPinnedIds={samplePinnedIds}
              isSample
            >
              <ContactsProvider initialContacts={sampleContacts} isSample>
                <CallsProvider initialCalls={sampleCalls} isSample>
                  <StatusBar style="light" />
                  <AppNavigation />
                </CallsProvider>
              </ContactsProvider>
            </ChatsProvider>
          </PermissionsProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
