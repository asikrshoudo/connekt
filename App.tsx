import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { InsetsCheckScreen } from './src/features/system/InsetsCheckScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <InsetsCheckScreen />
    </SafeAreaProvider>
  );
}
