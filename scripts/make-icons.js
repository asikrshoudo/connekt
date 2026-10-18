// Generates the Connekt app icon and splash images. No dependencies.
const fs = require('fs');
const zlib = require('zlib');

const SIZE = 1024;
const CENTER = 512;
const BUBBLE_Y = 500;
const SAMPLES = 3;

const DARK = [10, 10, 12, 255];
const WHITE = [255, 255, 255, 255];
const NONE = [0, 0, 0, 0];

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng(rgba) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(SIZE, 0);
  header.writeUInt32BE(SIZE, 4);
  header[8] = 8;
  header[9] = 6;
  const stride = SIZE * 4;
  const raw = Buffer.alloc((stride + 1) * SIZE);
  for (let y = 0; y < SIZE; y += 1) {
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Chat bubble: a circle with a tail at the bottom left.
const TAIL = [[330, 640], [262, 800], [470, 750]];

function side(p, a, b) {
  return (p[0] - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (p[1] - b[1]);
}

function inTriangle(p, [a, b, c]) {
  const d1 = side(p, a, b);
  const d2 = side(p, b, c);
  const d3 = side(p, c, a);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}

function inBubble(x, y) {
  const dx = x - CENTER;
  const dy = y - BUBBLE_Y;
  return dx * dx + dy * dy <= 270 * 270 || inTriangle([x, y], TAIL);
}

// The letter C: a ring with an opening on the right and rounded ends.
const GAP = 0.78;

function inLetter(x, y) {
  const dx = x - CENTER;
  const dy = y - BUBBLE_Y;
  const dist = Math.hypot(dx, dy);
  if (dist >= 92 && dist <= 150 && Math.abs(Math.atan2(dy, dx)) > GAP) return true;
  for (const end of [-1, 1]) {
    const ex = CENTER + 121 * Math.cos(end * GAP);
    const ey = BUBBLE_Y + 121 * Math.sin(end * GAP);
    if (Math.hypot(x - ex, y - ey) <= 29) return true;
  }
  return false;
}

function gradient(y) {
  const t = Math.min(1, Math.max(0, (y - 230) / 540));
  const top = [47, 140, 255];
  const bottom = [10, 108, 219];
  return [0, 1, 2].map((i) => Math.round(top[i] + (bottom[i] - top[i]) * t)).concat(255);
}

function render({ scale, background, bubble, letter }) {
  const rgba = Buffer.alloc(SIZE * SIZE * 4);
  const total = SAMPLES * SAMPLES;
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SAMPLES; sy += 1) {
        for (let sx = 0; sx < SAMPLES; sx += 1) {
          const px = CENTER + (x + (sx + 0.5) / SAMPLES - CENTER) / scale;
          const py = CENTER + (y + (sy + 0.5) / SAMPLES - CENTER) / scale;
          let color = background;
          if (inBubble(px, py)) color = inLetter(px, py) ? letter(py) : bubble(py);
          const alpha = color[3] / 255;
          r += color[0] * alpha;
          g += color[1] * alpha;
          b += color[2] * alpha;
          a += alpha;
        }
      }
      const i = (y * SIZE + x) * 4;
      if (a > 0) {
        rgba[i] = Math.round(r / a);
        rgba[i + 1] = Math.round(g / a);
        rgba[i + 2] = Math.round(b / a);
      }
      rgba[i + 3] = Math.round((a / total) * 255);
    }
  }
  return encodePng(rgba);
}

function solid(color) {
  const rgba = Buffer.alloc(SIZE * SIZE * 4);
  for (let i = 0; i < rgba.length; i += 4) {
    rgba[i] = color[0];
    rgba[i + 1] = color[1];
    rgba[i + 2] = color[2];
    rgba[i + 3] = color[3];
  }
  return encodePng(rgba);
}

const white = () => WHITE;
const cutout = () => NONE;

// Adaptive icons are cropped by a mask, so the glyph is drawn smaller there.
const files = {
  'assets/icon.png': () =>
    render({ scale: 1, background: DARK, bubble: gradient, letter: white }),
  'assets/android-icon-foreground.png': () =>
    render({ scale: 0.8, background: NONE, bubble: gradient, letter: white }),
  'assets/android-icon-monochrome.png': () =>
    render({ scale: 0.8, background: NONE, bubble: white, letter: cutout }),
  'assets/android-icon-background.png': () => solid(DARK),
};

let foreground = null;
for (const [file, make] of Object.entries(files)) {
  const png = make();
  fs.writeFileSync(file, png);
  if (file.endsWith('foreground.png')) foreground = png;
  console.log('wrote', file, png.length, 'bytes');
}
fs.writeFileSync('assets/splash-icon.png', foreground);
console.log('wrote assets/splash-icon.png');
