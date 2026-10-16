import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigation } from './src/core/navigation/AppNavigation';
import { ThemeProvider } from './src/core/theme/ThemeProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="light" />
        <AppNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
