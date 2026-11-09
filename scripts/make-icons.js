// Generates the Myth app icon and splash images. No dependencies.
const fs = require('fs');
const zlib = require('zlib');

const SIZE = 1024;
const CENTER = 512;
const SAMPLES = 3;

const DARK = [16, 21, 34, 255];
const WHITE = [255, 255, 255, 255];
const NONE = [0, 0, 0, 0];
const MARK = [
  [[352, 650], [352, 360]],
  [[352, 360], [512, 520]],
  [[512, 520], [672, 360]],
  [[672, 360], [672, 650]],
];
const MARK_WIDTH = 72;

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

function distanceToSegment(x, y, [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const position = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / lengthSquared));
  return Math.hypot(x - (ax + position * dx), y - (ay + position * dy));
}

function inMark(x, y) {
  return MARK.some(([start, end]) => distanceToSegment(x, y, start, end) <= MARK_WIDTH / 2);
}

function render({ scale, background, letter }) {
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
          const color = inMark(px, py) ? letter(py) : background;
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
// Adaptive icons are cropped by a mask, so the glyph is drawn smaller there.
const files = {
  'assets/icon.png': () => render({ scale: 1, background: DARK, letter: white }),
  'assets/android-icon-foreground.png': () => render({ scale: 0.8, background: NONE, letter: white }),
  'assets/android-icon-monochrome.png': () => render({ scale: 0.8, background: NONE, letter: white }),
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
fs.writeFileSync('assets/favicon.png', files['assets/icon.png']());
console.log('wrote assets/favicon.png');
