import type { Rect } from '../conversation/types';

// The biggest rectangle with the photo's shape that fits inside the screen, centred.
export function fitRect(
  contentWidth: number,
  contentHeight: number,
  containerWidth: number,
  containerHeight: number,
): Rect {
  if (contentWidth <= 0 || contentHeight <= 0) {
    return { x: 0, y: 0, width: containerWidth, height: containerHeight };
  }
  const scale = Math.min(containerWidth / contentWidth, containerHeight / contentHeight);
  const width = contentWidth * scale;
  const height = contentHeight * scale;
  return {
    x: (containerWidth - width) / 2,
    y: (containerHeight - height) / 2,
    width,
    height,
  };
}

// The same rectangle, smaller, around the same centre.
export function shrinkRect(rect: Rect, factor: number): Rect {
  const width = rect.width * factor;
  const height = rect.height * factor;
  return {
    x: rect.x + (rect.width - width) / 2,
    y: rect.y + (rect.height - height) / 2,
    width,
    height,
  };
}

// Which page of a horizontal pager is showing, from the scroll offset.
export function pageIndex(offsetX: number, pageWidth: number, count: number): number {
  if (pageWidth <= 0 || count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(offsetX / pageWidth)));
}
