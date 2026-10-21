import { Directory, File, Paths } from 'expo-file-system';

export type StorageSnapshot = {
  total: number;
  free: number;
  cache: number;
  documents: number;
};

function directorySize(directory: Directory): number {
  try {
    return directory.size ?? 0;
  } catch {
    return 0;
  }
}

export function readStorage(): StorageSnapshot {
  return {
    total: Paths.totalDiskSpace,
    free: Paths.availableDiskSpace,
    cache: directorySize(Paths.cache),
    documents: directorySize(Paths.document),
  };
}

// True for files Connekt itself keeps (copied picks, recordings, camera shots).
export function isAppFile(uri: string): boolean {
  return uri.startsWith(Paths.cache.uri) || uri.startsWith(Paths.document.uri);
}

export function fileSize(uri: string): number {
  try {
    return new File(uri).size;
  } catch {
    return 0;
  }
}

// Empties the cache folder. Returns how many bytes were freed.
export function clearCache(): number {
  const before = directorySize(Paths.cache);
  try {
    for (const item of Paths.cache.list()) {
      try {
        item.delete();
      } catch {
        // A file in use stays. The rest is still cleared.
      }
    }
  } catch {
    return 0;
  }
  return Math.max(0, before - directorySize(Paths.cache));
}
