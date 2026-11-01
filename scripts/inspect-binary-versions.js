const fs = require('fs');
const path = require('path');

const exePath = 'C:\\Users\\Admin\\AppData\\Local\\Programs\\VidCut\\VidCut.exe';
console.log('Reading binary:', exePath);
const buf = fs.readFileSync(exePath);

// Search for "Chrome/"
const str = buf.toString('utf8');

// Look for User Agent or versions
const electronRegex = /Electron\/([0-9.]+)/g;
let m;
const electronVersions = new Set();
while ((m = electronRegex.exec(str)) !== null) {
  electronVersions.add(m[1]);
}

const chromeRegex = /Chrome\/([0-9.]+)/g;
const chromeVersions = new Set();
while ((m = chromeRegex.exec(str)) !== null) {
  chromeVersions.add(m[1]);
}

const nodeRegex = /Node\.js\/([0-9.]+)/g;
const nodeVersions = new Set();
while ((m = nodeRegex.exec(str)) !== null) {
  nodeVersions.add(m[1]);
}

const v8Regex = /V8\/([0-9.]+)/g;
const v8Versions = new Set();
while ((m = v8Regex.exec(str)) !== null) {
  v8Versions.add(m[1]);
}

console.log('Electron versions found in binary:', Array.from(electronVersions));
console.log('Chrome versions found in binary:', Array.from(chromeVersions));
console.log('Node versions found in binary:', Array.from(nodeVersions));
console.log('V8 versions found in binary:', Array.from(v8Versions));

