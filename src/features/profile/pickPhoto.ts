import * as ImagePicker from 'expo-image-picker';

// Android's system picker with a square crop. No storage permission needed.
export async function pickProfilePhoto(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });
  if (result.canceled) return null;
  return result.assets[0]?.uri ?? null;
}
