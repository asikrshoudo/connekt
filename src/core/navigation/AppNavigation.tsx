import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useColors, useThemeSettings } from '../theme/ThemeProvider';
import { navigationRef } from './navigationRef';
import { RootNavigator } from './RootNavigator';

export function AppNavigation() {
  const colors = useColors();
  const { isDark } = useThemeSettings();
  const base = isDark ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
