import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigation } from './src/core/navigation/AppNavigation';
import { ThemeProvider } from './src/core/theme/ThemeProvider';
import { sampleCalls } from './src/data/sample/sampleCalls';
import { sampleConversations, samplePinnedIds } from './src/data/sample/sampleConversations';
import { sampleMessages } from './src/data/sample/sampleMessages';
import { CallsProvider } from './src/features/calls/CallsProvider';
import { ChatsProvider } from './src/features/chats/ChatsProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <ThemeProvider>
          <ChatsProvider
            initialConversations={sampleConversations}
            initialMessages={sampleMessages}
            initialPinnedIds={samplePinnedIds}
            isSample
          >
            <CallsProvider initialCalls={sampleCalls} isSample>
              <StatusBar style="light" />
              <AppNavigation />
            </CallsProvider>
          </ChatsProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
