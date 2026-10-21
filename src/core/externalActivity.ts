// Opening the gallery, camera, a permission dialog or the share sheet sends the app
// to the background for a moment. Those trips must not trigger the app lock.
let graceUntil = 0;

export function markExternalActivity(ms = 120_000): void {
  graceUntil = Date.now() + ms;
}

export function isExternalActivityActive(now: number = Date.now()): boolean {
  return now < graceUntil;
}
