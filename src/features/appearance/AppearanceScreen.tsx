import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { ChoiceRow } from '../../components/ui/ChoiceRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import type { RootStackParamList } from '../../core/navigation/types';
import { palettes, themeNames } from '../../core/theme/palettes';
import { spacing } from '../../core/theme/spacing';
import { useThemeSettings } from '../../core/theme/ThemeProvider';
import { THEME_IDS, THEME_MODES, type ThemeMode } from '../../core/theme/themeSettings';

type Props = NativeStackScreenProps<RootStackParamList, 'Appearance'>;

const MODE_LABELS: Record<ThemeMode, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

export function AppearanceScreen({ navigation }: Props) {
  const { settings, isDark, setThemeId, setMode } = useThemeSettings();
  const scheme = isDark ? 'dark' : 'light';

  return (
    <Screen>
      <ScreenHeader title="Appearance" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.lg }}>
        <SettingsSection title="Theme" footer="Your choice is saved on this device.">
          {THEME_IDS.map((id) => {
            const palette = palettes[id][scheme];
            return (
              <ChoiceRow
                key={id}
                label={themeNames[id]}
                selected={settings.themeId === id}
                onPress={() => setThemeId(id)}
                swatches={[palette.background, palette.surface, palette.accent]}
              />
            );
          })}
        </SettingsSection>

        <SettingsSection
          title="Mode"
          footer="System follows the light or dark setting of your phone."
        >
          {THEME_MODES.map((mode) => (
            <ChoiceRow
              key={mode}
              label={MODE_LABELS[mode]}
              selected={settings.mode === mode}
              onPress={() => setMode(mode)}
            />
          ))}
        </SettingsSection>
      </ScrollView>
    </Screen>
  );
}
