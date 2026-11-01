const fs = require('fs');

const sdkPath = 'node_modules/video-core-sdk/video-core-sdk.js';
console.log('Inspecting SDK export architecture...');

const content = fs.readFileSync(sdkPath, 'utf8');

// Check for WebCodecs, FFmpeg, mp4-muxer, WebAssembly, MediaRecorder
const checks = [
  'VideoEncoder',
  'AudioEncoder',
  'mp4-muxer',
  'createFFmpeg',
  'ffmpeg.wasm',
  'ffmpeg-core',
  'MediaRecorder',
  'MovieEncoding',
  'workerPath',
  'EModuleEffectSourcePath',
  'remixAudioURL',
];

for (const term of checks) {
  const matches = (content.match(new RegExp(term, 'g')) || []).length;
  console.log(`  - ${term}: ${matches} occurrence(s)`);
}

// Find worker configuration
const workerConfig = fs.readFileSync('worker.config.js', 'utf8');
console.log('\n--- worker.config.js ---');
console.log(workerConfig);
