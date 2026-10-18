import { StatusBar } from 'expo-status-bar';
import { useThemeSettings } from './ThemeProvider';

export function ThemedStatusBar() {
  const { isDark } = useThemeSettings();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}
