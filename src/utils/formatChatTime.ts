const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function formatChatTime(timestamp: number, now: number = Date.now()): string {
  const date = new Date(timestamp);
  const dayDiff = Math.round((startOfDay(new Date(now)) - startOfDay(date)) / DAY_MS);

  if (dayDiff <= 0) {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
  }
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7) return WEEKDAYS[date.getDay()] ?? '';
  return `${MONTHS[date.getMonth()] ?? ''} ${date.getDate()}`;
}
