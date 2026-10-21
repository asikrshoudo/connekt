export const TIMEOUT_OPTIONS = [30_000, 60_000, 300_000, 900_000, 3_600_000];

// The app locks when it was in the background for at least the chosen time.
export function shouldLockAfter(
  backgroundedAt: number | null,
  now: number,
  timeoutMs: number,
): boolean {
  if (backgroundedAt === null) return false;
  return now - backgroundedAt >= timeoutMs;
}

// How long to wait after a number of wrong PINs. The first 4 are free.
export function lockoutDelayMs(failedAttempts: number): number {
  if (failedAttempts < 5) return 0;
  const steps = [30_000, 60_000, 300_000, 900_000];
  return steps[Math.min(failedAttempts - 5, steps.length - 1)] ?? 900_000;
}

export function remainingLockoutMs(lockedUntil: number, now: number): number {
  return Math.max(0, lockedUntil - now);
}

export function formatTimeout(ms: number): string {
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? '1 hour' : `${hours} hours`;
}
