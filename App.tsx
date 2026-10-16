import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/core/theme/ThemeProvider';
import { InsetsCheckScreen } from './src/features/system/InsetsCheckScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="light" />
        <InsetsCheckScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
