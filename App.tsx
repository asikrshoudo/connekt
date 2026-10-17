import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { sampleConversations, samplePinnedIds } from './src/data/sample/sampleConversations';
import { AppNavigation } from './src/core/navigation/AppNavigation';
import { ThemeProvider } from './src/core/theme/ThemeProvider';
import { ChatsProvider } from './src/features/chats/ChatsProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ChatsProvider
          initialConversations={sampleConversations}
          initialPinnedIds={samplePinnedIds}
          isSample
        >
          <StatusBar style="light" />
          <AppNavigation />
        </ChatsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
