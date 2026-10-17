const ZWJ = 0x200d;
const VARIATION_SELECTOR = 0xfe0f;

function isModifier(cp: number): boolean {
  return (
    cp === VARIATION_SELECTOR ||
    cp === 0x20e3 ||
    (cp >= 0x1f3fb && cp <= 0x1f3ff) ||
    (cp >= 0xe0020 && cp <= 0xe007f)
  );
}

function isEmojiBase(cp: number): boolean {
  return (
    (cp >= 0x1f000 && cp <= 0x1faff) ||
    (cp >= 0x2600 && cp <= 0x27bf) ||
    (cp >= 0x2300 && cp <= 0x23ff) ||
    (cp >= 0x2b00 && cp <= 0x2bff) ||
    (cp >= 0x2190 && cp <= 0x21ff) ||
    cp === 0x203c ||
    cp === 0x2049 ||
    cp === 0x2122 ||
    cp === 0x2139 ||
    cp === 0x00a9 ||
    cp === 0x00ae
  );
}

// Returns how many emoji the text contains, or 0 if it has anything other than emoji.
export function countEmoji(text: string): number {
  const compact = text.replace(/\s+/g, '');
  if (compact.length === 0) return 0;

  let count = 0;
  let regionalIndicators = 0;
  let joined = false;

  for (const char of compact) {
    const cp = char.codePointAt(0) ?? 0;
    if (cp === ZWJ) {
      joined = true;
      continue;
    }
    if (isModifier(cp)) continue;
    if (!isEmojiBase(cp)) return 0;
    if (cp >= 0x1f1e6 && cp <= 0x1f1ff) {
      regionalIndicators += 1;
      continue;
    }
    if (joined) {
      joined = false;
      continue;
    }
    count += 1;
  }

  return count + Math.ceil(regionalIndicators / 2);
}
