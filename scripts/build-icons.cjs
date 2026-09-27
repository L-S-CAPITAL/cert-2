/*
 * Renders build/icon.svg into every app icon file electron-builder needs.
 *
 *   npx electron scripts/build-icons.cjs
 *   (on a headless Linux box: xvfb-run -a npx electron --no-sandbox scripts/build-icons.cjs)
 *
 * Uses Electron's own Chromium to rasterise the SVG, so no extra tools or
 * packages are needed. Outputs (all committed):
 *   build/icon.png            1024x1024 (electron-builder default)
 *   build/icons/NxN.png       16 … 1024 (Linux)
 *   build/icon.ico            16 … 256  (Windows, PNG-compressed entries)
 *   build/icon.icns           16 … 1024 (macOS, PNG-compressed entries)
 *   icon.png                  512x512   (window / taskbar icon at runtime)
 *
 * At 32px and below the hexagon stroke is thickened (data-small-stroke-width
 * in the SVG) so the outline stays visible.
 */
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build');
const svgSource = fs.readFileSync(path.join(buildDir, 'icon.svg'), 'utf8');

const SIZES = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];
// OSType → pixel size. PNG payloads are valid for all of these on macOS 10.7+.
const ICNS_TYPES = [
  ['icp4', 16],
  ['icp5', 32],
  ['icp6', 64],
  ['ic07', 128],
  ['ic08', 256],
  ['ic09', 512],
  ['ic10', 1024],
  ['ic11', 32],
  ['ic12', 64],
  ['ic13', 256],
  ['ic14', 512],
];

function svgForSize(size) {
  if (size > 32) return svgSource;
  return svgSource.replace(
    /stroke-width="[\d.]+"(\s+stroke-linejoin="round"\s+data-small-stroke-width="([\d.]+)")/,
    (_m, rest, small) => `stroke-width="${small}"${rest}`,
  );
}

async function render(win, size) {
  const url = `data:image/svg+xml;base64,${Buffer.from(svgForSize(size)).toString('base64')}`;
  const dataUrl = await win.webContents.executeJavaScript(`new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = ${size};
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, ${size}, ${size});
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('SVG failed to load'));
    img.src = ${JSON.stringify(url)};
  })`);
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(ICO_SIZES.length, 4);
  const entries = [];
  let offset = 6 + 16 * ICO_SIZES.length;
  for (const size of ICO_SIZES) {
    const png = pngs[size];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += png.length;
  }
  return Buffer.concat([header, ...entries, ...ICO_SIZES.map((s) => pngs[s])]);
}

function buildIcns(pngs) {
  const chunks = ICNS_TYPES.map(([type, size]) => {
    const head = Buffer.alloc(8);
    head.write(type, 0, 'ascii');
    head.writeUInt32BE(8 + pngs[size].length, 4);
    return Buffer.concat([head, pngs[size]]);
  });
  const body = Buffer.concat(chunks);
  const head = Buffer.alloc(8);
  head.write('icns', 0, 'ascii');
  head.writeUInt32BE(8 + body.length, 4);
  return Buffer.concat([head, body]);
}

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 64, height: 64 });
  await win.loadURL('about:blank');
  const pngs = {};
  for (const size of SIZES) pngs[size] = await render(win, size);

  fs.mkdirSync(path.join(buildDir, 'icons'), { recursive: true });
  for (const size of SIZES) {
    fs.writeFileSync(path.join(buildDir, 'icons', `${size}x${size}.png`), pngs[size]);
  }
  fs.writeFileSync(path.join(buildDir, 'icon.png'), pngs[1024]);
  fs.writeFileSync(path.join(buildDir, 'icon.ico'), buildIco(pngs));
  fs.writeFileSync(path.join(buildDir, 'icon.icns'), buildIcns(pngs));
  fs.writeFileSync(path.join(root, 'icon.png'), pngs[512]);
  console.log(`Wrote icons: ${SIZES.join(', ')} px, icon.ico, icon.icns, icon.png (512)`);
  app.quit();
});
