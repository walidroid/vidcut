const fs = require('fs');
const content = fs.readFileSync('node_modules/video-core-sdk/video-core-sdk.js', 'utf8');

const idx = content.indexOf('VideoEncoder');
if (idx !== -1) {
  console.log('VideoEncoder snippet:');
  console.log(content.substring(Math.max(0, idx - 200), idx + 400));
}

const idxAudio = content.indexOf('remixAudioURL');
if (idxAudio !== -1) {
  console.log('\nremixAudioURL snippet:');
  console.log(content.substring(Math.max(0, idxAudio - 200), idxAudio + 400));
}
