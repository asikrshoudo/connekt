import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import type { Attachment } from '../../types/chat';

function fromAsset(asset: ImagePicker.ImagePickerAsset): Attachment {
  if (asset.type === 'video') {
    return {
      kind: 'video',
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      durationMs: asset.duration ?? 0,
    };
  }
  return { kind: 'image', uri: asset.uri, width: asset.width, height: asset.height };
}

// Android's system picker: no storage permission needed.
export async function pickFromLibrary(kind: 'images' | 'videos'): Promise<Attachment[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: [kind],
    allowsMultipleSelection: true,
    selectionLimit: 10,
    quality: 0.8,
  });
  return result.canceled ? [] : result.assets.map(fromAsset);
}

// Needs the camera permission, which the caller checks first.
export async function takePhoto(): Promise<Attachment[]> {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images', 'videos'],
    quality: 0.8,
  });
  return result.canceled ? [] : result.assets.map(fromAsset);
}

export async function pickFile(): Promise<Attachment[]> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return [];
  return result.assets.map(
    (asset): Attachment => ({
      kind: 'file',
      uri: asset.uri,
      name: asset.name,
      size: asset.size ?? null,
    }),
  );
}

// Needs the location permission, which the caller checks first.
export async function getCurrentLocation(): Promise<Attachment> {
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    kind: 'location',
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export function openInMaps(latitude: number, longitude: number): Promise<void> {
  return Linking.openURL(`geo:${latitude},${longitude}?q=${latitude},${longitude}`);
}

// Opens the file with another app on the phone. Throws if nothing can open it.
export async function openFile(attachment: Extract<Attachment, { kind: 'file' }>): Promise<void> {
  const file = new File(attachment.uri);
  await Promise.resolve(file.preview());
}
