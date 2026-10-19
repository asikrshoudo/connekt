import * as MediaLibrary from 'expo-media-library/legacy';
import { useEffect, useState } from 'react';

const COUNT = 30;

export type RecentItem = {
  id: string;
  uri: string;
  kind: 'image' | 'video';
  width: number;
  height: number;
  durationMs: number;
};

// Newest photos and videos on the phone. Only call this once photo access is granted.
export function useRecentMedia(enabled: boolean): RecentItem[] {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    MediaLibrary.getAssetsAsync({
      first: COUNT,
      mediaType: ['photo', 'video'],
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    })
      .then(({ assets }) => {
        if (!active) return;
        setItems(
          assets.map((asset) => ({
            id: asset.id,
            uri: asset.uri,
            kind: asset.mediaType === 'video' ? 'video' : 'image',
            width: asset.width,
            height: asset.height,
            durationMs: Math.round(asset.duration * 1000),
          })),
        );
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, [enabled]);

  return items;
}
