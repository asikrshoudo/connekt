import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from './src/components/feedback/ToastProvider';
import { ErrorBoundary } from './src/core/ErrorBoundary';
import { NotificationSettingsProvider } from './src/features/notifications/NotificationSettingsProvider';
import { AppLockGate } from './src/features/security/AppLockGate';
import { AppLockProvider } from './src/features/security/AppLockProvider';
import { AppNavigation } from './src/core/navigation/AppNavigation';
import { PermissionsProvider } from './src/core/permissions/PermissionsProvider';
import { ThemeProvider } from './src/core/theme/ThemeProvider';
import { ThemedStatusBar } from './src/core/theme/ThemedStatusBar';
import { CallsProvider } from './src/features/calls/CallsProvider';
import { ChatsProvider } from './src/features/chats/ChatsProvider';
import { ProfileProvider } from './src/features/profile/ProfileProvider';
import { ContactCardHost } from './src/features/contacts/ContactCardHost';
import { ContactsProvider } from './src/features/contacts/ContactsProvider';
import { OnboardingGate } from './src/features/onboarding/OnboardingGate';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <KeyboardProvider>
        <ThemeProvider>
          <ErrorBoundary>
          <ProfileProvider>
          <NotificationSettingsProvider>
          <AppLockProvider>
          <PermissionsProvider>
            <ChatsProvider initialConversations={[]}>
              <ContactsProvider initialContacts={[]}>
                <CallsProvider initialCalls={[]}>
                  <ThemedStatusBar />
                  <ContactCardHost>
                    <AppLockGate>
                      <ToastProvider>
                        <OnboardingGate>
                          <AppNavigation />
                        </OnboardingGate>
                      </ToastProvider>
                    </AppLockGate>
                  </ContactCardHost>
                </CallsProvider>
              </ContactsProvider>
            </ChatsProvider>
          </PermissionsProvider>
          </AppLockProvider>
          </NotificationSettingsProvider>
          </ProfileProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
