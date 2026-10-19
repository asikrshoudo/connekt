import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/core/ErrorBoundary';
import { AppNavigation } from './src/core/navigation/AppNavigation';
import { PermissionsProvider } from './src/core/permissions/PermissionsProvider';
import { ThemeProvider } from './src/core/theme/ThemeProvider';
import { ThemedStatusBar } from './src/core/theme/ThemedStatusBar';
import { sampleCalls } from './src/data/sample/sampleCalls';
import { sampleContacts } from './src/data/sample/sampleContacts';
import { sampleConversations, samplePinnedIds } from './src/data/sample/sampleConversations';
import { sampleMessages } from './src/data/sample/sampleMessages';
import { sampleRequests } from './src/data/sample/sampleRequests';
import { CallsProvider } from './src/features/calls/CallsProvider';
import { ChatsProvider } from './src/features/chats/ChatsProvider';
import { ProfileProvider } from './src/features/profile/ProfileProvider';
import { ContactCardHost } from './src/features/contacts/ContactCardHost';
import { ContactsProvider } from './src/features/contacts/ContactsProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <ThemeProvider>
          <ErrorBoundary>
          <ProfileProvider>
          <PermissionsProvider>
            <ChatsProvider
              initialConversations={sampleConversations}
              initialMessages={sampleMessages}
              initialPinnedIds={samplePinnedIds}
              initialRequests={sampleRequests}
              isSample
            >
              <ContactsProvider initialContacts={sampleContacts} isSample>
                <CallsProvider initialCalls={sampleCalls} isSample>
                  <ThemedStatusBar />
                  <ContactCardHost>
                    <AppNavigation />
                  </ContactCardHost>
                </CallsProvider>
              </ContactsProvider>
            </ChatsProvider>
          </PermissionsProvider>
          </ProfileProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
