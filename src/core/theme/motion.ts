// Starting values, to be tuned on a real device.
export const duration = { fast: 150, base: 250, slow: 350 } as const;

export const spring = {
  snappy: { damping: 22, stiffness: 320, mass: 1 },
  gentle: { damping: 26, stiffness: 180, mass: 1 },
} as const;
