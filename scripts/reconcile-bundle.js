const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const distDir = path.resolve('dist');

function getFileInfo(relPath) {
  const fullPath = path.join(distDir, relPath);
  if (!fs.existsSync(fullPath)) return null;
  const buf = fs.readFileSync(fullPath);
  const raw = buf.length;
  const gzip = zlib.gzipSync(buf).length;
  const brotli = zlib.brotliCompressSync(buf).length;
  return { path: relPath, raw, gzip, brotli };
}

function reconcile() {
  console.log('=== VidCut Production Build Asset Reconciliation ===\n');

  const jsFiles = fs.readdirSync(path.join(distDir, 'homeAssets', 'js'))
    .map(f => getFileInfo(`homeAssets/js/${f}`));

  const cssFiles = fs.readdirSync(path.join(distDir, 'homeAssets', 'css'))
    .map(f => getFileInfo(`homeAssets/css/${f}`));

  const htmlFile = getFileInfo('index.html');

  console.log('--- JAVASCRIPT ARTIFACTS ---');
  let jsRawSum = 0, jsGzipSum = 0, jsBrotliSum = 0;
  for (const f of jsFiles) {
    jsRawSum += f.raw;
    jsGzipSum += f.gzip;
    jsBrotliSum += f.brotli;
    console.log(`  ${f.path.padEnd(45)} | Raw: ${(f.raw/1024).toFixed(1).padStart(7)} kB | Gzip: ${(f.gzip/1024).toFixed(1).padStart(7)} kB | Brotli: ${(f.brotli/1024).toFixed(1).padStart(7)} kB`);
  }
  console.log(`  ${'TOTAL JS'.padEnd(45)} | Raw: ${(jsRawSum/1024).toFixed(1).padStart(7)} kB | Gzip: ${(jsGzipSum/1024).toFixed(1).padStart(7)} kB | Brotli: ${(jsBrotliSum/1024).toFixed(1).padStart(7)} kB\n`);

  console.log('--- CSS ARTIFACTS ---');
  let cssRawSum = 0, cssGzipSum = 0, cssBrotliSum = 0;
  for (const f of cssFiles) {
    cssRawSum += f.raw;
    cssGzipSum += f.gzip;
    cssBrotliSum += f.brotli;
    console.log(`  ${f.path.padEnd(45)} | Raw: ${(f.raw/1024).toFixed(1).padStart(7)} kB | Gzip: ${(f.gzip/1024).toFixed(1).padStart(7)} kB | Brotli: ${(f.brotli/1024).toFixed(1).padStart(7)} kB`);
  }
  console.log(`  ${'TOTAL CSS'.padEnd(45)} | Raw: ${(cssRawSum/1024).toFixed(1).padStart(7)} kB | Gzip: ${(cssGzipSum/1024).toFixed(1).padStart(7)} kB | Brotli: ${(cssBrotliSum/1024).toFixed(1).padStart(7)} kB\n`);

  // Route Classification
  // Workspace / Initial route:
  // JS: main, vendor-react, vendor-semi, vendor-icons, vendor-utils
  // CSS: index, vendor-react, vendor-semi, vendor-icons
  const workspaceJs = jsFiles.filter(f => !f.path.includes('EditorPage') && !f.path.includes('vendor-editor'));
  const workspaceCss = cssFiles.filter(f => !f.path.includes('EditorPage'));
  
  let wsJsRaw = 0, wsJsGz = 0, wsJsBr = 0;
  workspaceJs.forEach(f => { wsJsRaw += f.raw; wsJsGz += f.gzip; wsJsBr += f.brotli; });

  let wsCssRaw = 0, wsCssGz = 0, wsCssBr = 0;
  workspaceCss.forEach(f => { wsCssRaw += f.raw; wsCssGz += f.gzip; wsCssBr += f.brotli; });

  const wsTotalRaw = wsJsRaw + wsCssRaw + htmlFile.raw;
  const wsTotalGz = wsJsGz + wsCssGz + htmlFile.gzip;
  const wsTotalBr = wsJsBr + wsCssBr + htmlFile.brotli;

  // Editor-only route additions:
  // JS: EditorPage, vendor-editor
  // CSS: EditorPage
  const editorJs = jsFiles.filter(f => f.path.includes('EditorPage') || f.path.includes('vendor-editor'));
  const editorCss = cssFiles.filter(f => f.path.includes('EditorPage'));

  let edJsRaw = 0, edJsGz = 0, edJsBr = 0;
  editorJs.forEach(f => { edJsRaw += f.raw; edJsGz += f.gzip; edJsBr += f.brotli; });

  let edCssRaw = 0, edCssGz = 0, edCssBr = 0;
  editorCss.forEach(f => { edCssRaw += f.raw; edCssGz += f.gzip; edCssBr += f.brotli; });

  const edTotalRaw = edJsRaw + edCssRaw;
  const edTotalGz = edJsGz + edCssGz;
  const edTotalBr = edJsBr + edCssBr;

  console.log('--- RECONCILED ROUTE BREAKDOWN ---');
  console.log('1. Initial Workspace / Home Route (Downloaded on initial page hit):');
  console.log(`   HTML:     ${(htmlFile.raw / 1024).toFixed(2)} kB raw | ${(htmlFile.gzip / 1024).toFixed(2)} kB gzip | ${(htmlFile.brotli / 1024).toFixed(2)} kB brotli`);
  console.log(`   JS (5):   ${(wsJsRaw / 1024).toFixed(2)} kB raw | ${(wsJsGz / 1024).toFixed(2)} kB gzip | ${(wsJsBr / 1024).toFixed(2)} kB brotli`);
  console.log(`   CSS (4):  ${(wsCssRaw / 1024).toFixed(2)} kB raw | ${(wsCssGz / 1024).toFixed(2)} kB gzip | ${(wsCssBr / 1024).toFixed(2)} kB brotli`);
  console.log(`   --> TOTAL INITIAL ROUTE: ${(wsTotalRaw / 1024 / 1024).toFixed(2)} MB (${wsTotalRaw.toLocaleString()} bytes) raw | ${(wsTotalGz / 1024).toFixed(2)} kB gzip | ${(wsTotalBr / 1024).toFixed(2)} kB brotli\n`);

  console.log('2. Deferred Editor Route (Downloaded ONLY when entering /editor):');
  console.log(`   JS (2):   ${(edJsRaw / 1024).toFixed(2)} kB raw | ${(edJsGz / 1024).toFixed(2)} kB gzip | ${(edJsBr / 1024).toFixed(2)} kB brotli`);
  console.log(`   CSS (1):  ${(edCssRaw / 1024).toFixed(2)} kB raw | ${(edCssGz / 1024).toFixed(2)} kB gzip | ${(edCssBr / 1024).toFixed(2)} kB brotli`);
  console.log(`   --> TOTAL DEFERRED EDITOR: ${(edTotalRaw / 1024 / 1024).toFixed(2)} MB (${edTotalRaw.toLocaleString()} bytes) raw | ${(edTotalGz / 1024).toFixed(2)} kB gzip | ${(edTotalBr / 1024).toFixed(2)} kB brotli\n`);

  console.log('3. Grand Total Build Artifacts:');
  const grandRaw = wsTotalRaw + edTotalRaw;
  const grandGz = wsTotalGz + edTotalGz;
  const grandBr = wsTotalBr + edTotalBr;
  console.log(`   Raw on Disk: ${(grandRaw / 1024 / 1024).toFixed(2)} MB (${grandRaw.toLocaleString()} bytes)`);
  console.log(`   Gzip:        ${(grandGz / 1024 / 1024).toFixed(2)} MB (${grandGz.toLocaleString()} bytes)`);
  console.log(`   Brotli:      ${(grandBr / 1024 / 1024).toFixed(2)} MB (${grandBr.toLocaleString()} bytes)\n`);

  console.log('Reconciliation Verification:');
  console.log(`  wsTotalRaw (${wsTotalRaw}) + edTotalRaw (${edTotalRaw}) === grandRaw (${grandRaw}): ${wsTotalRaw + edTotalRaw === grandRaw}`);
  console.log(`  wsTotalGz (${wsTotalGz}) + edTotalGz (${edTotalGz}) === grandGz (${grandGz}): ${wsTotalGz + edTotalGz === grandGz}`);
  console.log(`  wsTotalBr (${wsTotalBr}) + edTotalBr (${edTotalBr}) === grandBr (${grandBr}): ${wsTotalBr + edTotalBr === grandBr}`);
}

reconcile();

