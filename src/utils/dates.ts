export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

// How many calendar days `timestamp` is before `now` (0 = same day).
export function dayDifference(timestamp: number, now: number = Date.now()): number {
  return Math.round((startOfDay(now) - startOfDay(timestamp)) / DAY_MS);
}

export function formatClockTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
}

export function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${MONTHS[date.getMonth()] ?? ''} ${date.getDate()}`;
}
