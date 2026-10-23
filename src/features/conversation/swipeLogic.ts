// How far a message must be dragged to start a reply.
export const REPLY_THRESHOLD = 56;
// The message never moves further than this.
export const MAX_OFFSET = 84;

// Past the threshold the message gets harder to drag, like a rubber band.
export function resistedOffset(drag: number): number {
  const direction = drag < 0 ? -1 : 1;
  const distance = Math.abs(drag);
  const eased =
    distance <= REPLY_THRESHOLD
      ? distance
      : REPLY_THRESHOLD + (distance - REPLY_THRESHOLD) * 0.35;
  return direction * Math.min(eased, MAX_OFFSET);
}

// True when the finger was dragged far enough, in either direction.
export function isReplySwipe(drag: number): boolean {
  return Math.abs(drag) >= REPLY_THRESHOLD;
}
