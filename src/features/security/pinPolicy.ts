export const PIN_LENGTH = 6;

export function isValidPinFormat(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

// Rejects PINs that are easy to guess: 111111, 123456, 654321.
export function isWeakPin(pin: string): boolean {
  if (!/^\d+$/.test(pin)) return true;
  if (new Set(pin).size === 1) return true;
  const digits = [...pin].map(Number);
  const steps = digits.slice(1).map((digit, index) => digit - (digits[index] ?? 0));
  return steps.every((step) => step === 1) || steps.every((step) => step === -1);
}
