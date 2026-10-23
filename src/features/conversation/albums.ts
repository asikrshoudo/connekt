import type { Attachment, MediaItem } from '../../types/chat';

export function isMediaItem(attachment: Attachment): attachment is MediaItem {
  return attachment.kind === 'image' || attachment.kind === 'video';
}

// Two or more photos and videos sent together become one album message.
export function groupMedia(items: Attachment[]): Attachment[] {
  const media = items.filter(isMediaItem);
  if (media.length < 2) return items;
  const others = items.filter((item) => !isMediaItem(item));
  return [{ kind: 'album', items: media }, ...others];
}

export type TileRect = { x: number; y: number; width: number; height: number };
export type AlbumLayout = { width: number; height: number; tiles: TileRect[]; hidden: number };

// Where each photo goes. Five or more photos show four tiles, and `hidden` is the rest.
export function albumLayout(count: number, width: number, gap = 3): AlbumLayout {
  const total = Math.max(1, count);
  const half = Math.floor((width - gap) / 2);
  const rightX = width - half;

  if (total === 1) {
    return { width, height: width, hidden: 0, tiles: [{ x: 0, y: 0, width, height: width }] };
  }

  if (total === 2) {
    const height = Math.round(half * 1.35);
    return {
      width,
      height,
      hidden: 0,
      tiles: [
        { x: 0, y: 0, width: half, height },
        { x: rightX, y: 0, width: half, height },
      ],
    };
  }

  if (total === 3) {
    const height = width;
    const leftWidth = Math.round((width - gap) * 0.62);
    const rightWidth = width - leftWidth - gap;
    const topHeight = Math.floor((height - gap) / 2);
    const bottomY = topHeight + gap;
    return {
      width,
      height,
      hidden: 0,
      tiles: [
        { x: 0, y: 0, width: leftWidth, height },
        { x: leftWidth + gap, y: 0, width: rightWidth, height: topHeight },
        { x: leftWidth + gap, y: bottomY, width: rightWidth, height: height - bottomY },
      ],
    };
  }

  const bottomY = half + gap;
  return {
    width,
    height: half * 2 + gap,
    hidden: total - 4,
    tiles: [
      { x: 0, y: 0, width: half, height: half },
      { x: rightX, y: 0, width: half, height: half },
      { x: 0, y: bottomY, width: half, height: half },
      { x: rightX, y: bottomY, width: half, height: half },
    ],
  };
}
