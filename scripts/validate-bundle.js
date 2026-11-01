const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const jsDir = 'dist/homeAssets/js';
const files = fs.readdirSync(jsDir);

console.log('| Chunk Filename | Raw Size | Gzip Size | Brotli Size | Loaded On |');
console.log('| :--- | :--- | :--- | :--- | :--- |');

let homeTotalRaw = 0, homeTotalGzip = 0, homeTotalBrotli = 0;
let editorTotalRaw = 0, editorTotalGzip = 0, editorTotalBrotli = 0;

for (const file of files) {
  const buf = fs.readFileSync(path.join(jsDir, file));
  const raw = buf.length;
  const gz = zlib.gzipSync(buf).length;
  const br = zlib.brotliCompressSync(buf).length;
  
  const isEditorOnly = file.startsWith('EditorPage') || file.startsWith('vendor-editor');
  const route = isEditorOnly ? 'Editor Route Only (/editor)' : 'Initial / Home Workspace';

  console.log(`| \`${file}\` | ${(raw / 1024).toFixed(1)} kB (${raw.toLocaleString()} B) | ${(gz / 1024).toFixed(1)} kB | ${(br / 1024).toFixed(1)} kB | ${route} |`);

  if (isEditorOnly) {
    editorTotalRaw += raw;
    editorTotalGzip += gz;
    editorTotalBrotli += br;
  } else {
    homeTotalRaw += raw;
    homeTotalGzip += gz;
    homeTotalBrotli += br;
  }
}

console.log('\n--- Route Payload Breakdown ---');
console.log(`Initial / Workspace Route:`);
console.log(`  Raw:    ${(homeTotalRaw / 1024 / 1024).toFixed(2)} MB (${homeTotalRaw.toLocaleString()} bytes)`);
console.log(`  Gzip:   ${(homeTotalGzip / 1024).toFixed(1)} kB (${homeTotalGzip.toLocaleString()} bytes)`);
console.log(`  Brotli: ${(homeTotalBrotli / 1024).toFixed(1)} kB (${homeTotalBrotli.toLocaleString()} bytes)`);

console.log(`\nEditor Chunks (Deferred until user opens project):`);
console.log(`  Raw:    ${(editorTotalRaw / 1024 / 1024).toFixed(2)} MB (${editorTotalRaw.toLocaleString()} bytes)`);
console.log(`  Gzip:   ${(editorTotalGzip / 1024).toFixed(1)} kB (${editorTotalGzip.toLocaleString()} bytes)`);
console.log(`  Brotli: ${(editorTotalBrotli / 1024).toFixed(1)} kB (${editorTotalBrotli.toLocaleString()} bytes)`);

// Check HTML script tags to verify entry point
const html = fs.readFileSync('dist/index.html', 'utf8');
console.log('\n--- Script tags in dist/index.html ---');
const scriptMatches = html.match(/<script[^>]+src="[^"]+"[^>]*><\/script>/g) || [];
scriptMatches.forEach(tag => console.log(tag));

