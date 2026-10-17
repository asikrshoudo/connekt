import { dayDifference, formatShortDate, WEEKDAYS } from './dates';

export function formatDayLabel(timestamp: number, now: number = Date.now()): string {
  const diff = dayDifference(timestamp, now);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return WEEKDAYS[new Date(timestamp).getDay()] ?? '';
  return formatShortDate(timestamp);
}
