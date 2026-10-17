import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { sampleConversations, samplePinnedIds } from './src/data/sample/sampleConversations';
import { sampleMessages } from './src/data/sample/sampleMessages';
import { AppNavigation } from './src/core/navigation/AppNavigation';
import { ThemeProvider } from './src/core/theme/ThemeProvider';
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
            <StatusBar style="light" />
            <AppNavigation />
          </ChatsProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
