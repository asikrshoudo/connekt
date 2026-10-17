import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { useColors } from '../theme/ThemeProvider';
import { RootNavigator } from './RootNavigator';

export function AppNavigation() {
  const colors = useColors();
  const theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
