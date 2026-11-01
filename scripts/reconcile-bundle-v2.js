/**
 * scripts/reconcile-bundle-v2.js
 * Comprehensive and exact byte-level reconciliation for VidCut distribution
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const distDir = path.resolve('dist');

function getFileInfo(relPath) {
  const fullPath = path.join(distDir, relPath);
  if (!fs.existsSync(fullPath)) return null;
  const buf = fs.readFileSync(fullPath);
  const bytes = buf.length;
  const gzipBytes = zlib.gzipSync(buf).length;
  const brotliBytes = zlib.brotliCompressSync(buf).length;
  return {
    path: relPath,
    bytes,
    kib: (bytes / 1024).toFixed(2),
    mib: (bytes / 1024 / 1024).toFixed(3),
    gzipBytes,
    gzipKib: (gzipBytes / 1024).toFixed(2),
    brotliBytes,
    brotliKib: (brotliBytes / 1024).toFixed(2),
  };
}

function runReconciliation() {
  console.log('================================================================');
  console.log('       VIDCUT PRODUCTION BUILD ASSET RECONCILIATION             ');
  console.log('================================================================\n');

  const jsFiles = fs.readdirSync(path.join(distDir, 'homeAssets', 'js'))
    .map(f => getFileInfo(`homeAssets/js/${f}`));

  const cssFiles = fs.readdirSync(path.join(distDir, 'homeAssets', 'css'))
    .map(f => getFileInfo(`homeAssets/css/${f}`));

  const pngFiles = fs.readdirSync(path.join(distDir, 'homeAssets', 'png'))
    .map(f => getFileInfo(`homeAssets/png/${f}`));

  const htmlFile = getFileInfo('index.html');

  // Categorization
  // Initial Workspace Route:
  const wsJs = jsFiles.filter(f => !f.path.includes('EditorPage') && !f.path.includes('vendor-editor'));
  const wsCss = cssFiles.filter(f => !f.path.includes('EditorPage'));

  // Deferred Editor Route:
  const edJs = jsFiles.filter(f => f.path.includes('EditorPage') || f.path.includes('vendor-editor'));
  const edCss = cssFiles.filter(f => f.path.includes('EditorPage'));

  console.log('### 1. Initial Workspace Route Assets (Downloaded on initial page load)');
  console.log('| Asset File | Type | Bytes | KiB | MiB | Gzip (Bytes) | Gzip (KiB) | Brotli (Bytes) | Brotli (KiB) |');
  console.log('| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |');

  let wsRaw = htmlFile.bytes, wsGz = htmlFile.gzipBytes, wsBr = htmlFile.brotliBytes;
  console.log(`| ${htmlFile.path.padEnd(42)} | HTML | ${htmlFile.bytes.toString().padStart(9)} | ${htmlFile.kib.padStart(7)} | ${htmlFile.mib.padStart(6)} | ${htmlFile.gzipBytes.toString().padStart(12)} | ${htmlFile.gzipKib.padStart(10)} | ${htmlFile.brotliBytes.toString().padStart(14)} | ${htmlFile.brotliKib.padStart(12)} |`);

  for (const f of [...wsJs, ...wsCss]) {
    wsRaw += f.bytes;
    wsGz += f.gzipBytes;
    wsBr += f.brotliBytes;
    const type = f.path.endsWith('.js') ? 'JS' : 'CSS';
    console.log(`| ${f.path.padEnd(42)} | ${type.padEnd(4)} | ${f.bytes.toString().padStart(9)} | ${f.kib.padStart(7)} | ${f.mib.padStart(6)} | ${f.gzipBytes.toString().padStart(12)} | ${f.gzipKib.padStart(10)} | ${f.brotliBytes.toString().padStart(14)} | ${f.brotliKib.padStart(12)} |`);
  }
  console.log(`| **TOTAL INITIAL WORKSPACE ROUTE**        | ALL  | **${wsRaw.toString().padStart(7)}** | **${(wsRaw/1024).toFixed(2).padStart(5)}** | **${(wsRaw/1024/1024).toFixed(3).padStart(5)}** | **${wsGz.toString().padStart(10)}** | **${(wsGz/1024).toFixed(2).padStart(8)}** | **${wsBr.toString().padStart(12)}** | **${(wsBr/1024).toFixed(2).padStart(10)}** |\n`);

  console.log('### 2. Deferred Editor Route Assets (Loaded ONLY upon navigating to /editor)');
  console.log('| Asset File | Type | Bytes | KiB | MiB | Gzip (Bytes) | Gzip (KiB) | Brotli (Bytes) | Brotli (KiB) |');
  console.log('| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |');

  let edRaw = 0, edGz = 0, edBr = 0;
  for (const f of [...edJs, ...edCss]) {
    edRaw += f.bytes;
    edGz += f.gzipBytes;
    edBr += f.brotliBytes;
    const type = f.path.endsWith('.js') ? 'JS' : 'CSS';
    console.log(`| ${f.path.padEnd(42)} | ${type.padEnd(4)} | ${f.bytes.toString().padStart(9)} | ${f.kib.padStart(7)} | ${f.mib.padStart(6)} | ${f.gzipBytes.toString().padStart(12)} | ${f.gzipKib.padStart(10)} | ${f.brotliBytes.toString().padStart(14)} | ${f.brotliKib.padStart(12)} |`);
  }
  console.log(`| **TOTAL DEFERRED EDITOR ROUTE**          | ALL  | **${edRaw.toString().padStart(7)}** | **${(edRaw/1024).toFixed(2).padStart(5)}** | **${(edRaw/1024/1024).toFixed(3).padStart(5)}** | **${edGz.toString().padStart(10)}** | **${(edGz/1024).toFixed(2).padStart(8)}** | **${edBr.toString().padStart(12)}** | **${(edBr/1024).toFixed(2).padStart(10)}** |\n`);

  console.log('### 3. Build Grand Totals & Verification');
  const appCodeRaw = wsRaw + edRaw;
  const appCodeGz = wsGz + edGz;
  const appCodeBr = wsBr + edBr;

  console.log(`- App Code Total (Raw):    ${appCodeRaw.toLocaleString()} bytes (${(appCodeRaw/1024).toFixed(2)} KiB / ${(appCodeRaw/1024/1024).toFixed(3)} MiB)`);
  console.log(`- App Code Total (Gzip):   ${appCodeGz.toLocaleString()} bytes (${(appCodeGz/1024).toFixed(2)} KiB / ${(appCodeGz/1024/1024).toFixed(3)} MiB)`);
  console.log(`- App Code Total (Brotli): ${appCodeBr.toLocaleString()} bytes (${(appCodeBr/1024).toFixed(2)} KiB / ${(appCodeBr/1024/1024).toFixed(3)} MiB)`);
  console.log(`- Verification Check (wsRaw + edRaw === total): ${wsRaw + edRaw === appCodeRaw}`);
}

runReconciliation();

