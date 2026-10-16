import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { useColors } from '../theme/ThemeProvider';
import { RootTabs } from './RootTabs';

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
      <RootTabs />
    </NavigationContainer>
  );
}
