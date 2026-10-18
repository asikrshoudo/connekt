import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Avatar } from '../../components/ui/Avatar';
import { PillButton } from '../../components/ui/PillButton';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { pickProfilePhoto } from './pickPhoto';
import { MAX_ABOUT, MAX_NAME } from './profileModel';
import { ProfileField } from './ProfileField';
import { useProfile } from './ProfileProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { profile, save } = useProfile();
  const [name, setName] = useState(profile.displayName);
  const [about, setAbout] = useState(profile.about);
  const [photoUri, setPhotoUri] = useState<string | null>(profile.photoUri);
  const [failed, setFailed] = useState(false);

  const trimmedName = name.trim();
  const changed =
    trimmedName !== profile.displayName ||
    about.trim() !== profile.about ||
    photoUri !== profile.photoUri;
  const canSave = trimmedName.length > 0 && changed;

  const changePhoto = async () => {
    try {
      const uri = await pickProfilePhoto();
      if (uri) setPhotoUri(uri);
    } catch {
      setFailed(true);
    }
  };

  const submit = () => {
    if (!canSave) return;
    save({ displayName: trimmedName, about: about.trim(), photoUri });
    navigation.goBack();
  };

  return (
    <Screen>
      <ScreenHeader title="Edit profile" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <Avatar name={trimmedName || 'You'} size={112} uri={photoUri} />
            <View style={styles.photoActions}>
              <PillButton label="Change photo" variant="subtle" onPress={() => void changePhoto()} />
              {photoUri ? (
                <PillButton label="Remove photo" variant="subtle" onPress={() => setPhotoUri(null)} />
              ) : null}
            </View>
          </View>
          <ProfileField label="Name" value={name} onChangeText={setName} maxLength={MAX_NAME} />
          <ProfileField
            label="About"
            value={about}
            onChangeText={setAbout}
            maxLength={MAX_ABOUT}
            multiline
            placeholder="A short bio"
          />
        </ScrollView>
        <View style={styles.footer}>
          <PillButton size="large" label="Save" onPress={submit} disabled={!canSave} />
        </View>
      </KeyboardAvoidingView>

      <ActionSheet
        visible={failed}
        title="Could not pick a photo"
        message="Please try again."
        actions={[]}
        cancelLabel="OK"
        onClose={() => setFailed(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: spacing.xl, gap: spacing.lg },
  hero: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  photoActions: { flexDirection: 'row', gap: spacing.sm },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});
