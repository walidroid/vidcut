const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../node_modules/video-core-sdk/video-core-sdk.js');

if (!fs.existsSync(targetPath)) {
  console.log('[patch-sdk] video-core-sdk not found, skipping patch.');
  process.exit(0);
}

let code = fs.readFileSync(targetPath, 'utf8');
let modified = false;

// 1. Initial state: set je (isLoaded) to true immediately so the player never hangs
const s1 = 'const[ze,Ue]=useState(0),[je,Ve]=useState(!1),[He,We]=useState(!1)';
const r1 = 'const[ze,Ue]=useState(100),[je,Ve]=useState(!0),[He,We]=useState(!0)';
if (code.includes(s1)) {
  code = code.replace(s1, r1);
  modified = true;
  console.log('[patch-sdk] Successfully patched initialState to ready (true).');
} else if (code.includes(r1)) {
  console.log('[patch-sdk] initialState already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find initialState pattern.');
}

// 2. Safe Assets.load & loadUsedResource inside try-catch to prevent uncaught promise rejection
const s2 = 'console.log("资源加载");const Z=await Assets.load([{alias:"displacementMap",src:Je.reURL("/assets/images/displacement_map.png")},{alias:"overlayMap",src:Je.reURL("/assets/images/overlay.png")},{alias:"colorMap",src:Je.reURL("/assets/images/colormap.png")},{alias:"lightMap",src:Je.reURL("/assets/images/lightmap.png")}]);Je.assetsMap=Z,await Je.resourceManage.loadUsedResource((E=>{Ue(100*E),Ee&&Ee(E)}),!!Me,10,J),Ve(!0),setTimeout((()=>{We(!0)}),500)';
const r2 = 'console.log("资源加载");let Z=null;try{Z=await Assets.load([{alias:"displacementMap",src:Je.reURL("/assets/images/displacement_map.png")},{alias:"overlayMap",src:Je.reURL("/assets/images/overlay.png")},{alias:"colorMap",src:Je.reURL("/assets/images/colormap.png")},{alias:"lightMap",src:Je.reURL("/assets/images/lightmap.png")}]);}catch(e){console.warn("Assets.load safe catch:",e);}Je.assetsMap=Z;try{await Je.resourceManage.loadUsedResource((E=>{Ue(100*E),Ee&&Ee(E)}),!!Me,10,J);}catch(e){console.warn("loadUsedResource safe catch:",e);}Ve(!0);We(!0);';
if (code.includes(s2)) {
  code = code.replace(s2, r2);
  modified = true;
  console.log('[patch-sdk] Successfully wrapped Assets.load and loadUsedResource in try-catch.');
} else if (code.includes(r2)) {
  console.log('[patch-sdk] Assets.load try-catch already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find Assets.load pattern.');
}

// 3. Bypass the loading overlay div to never block the canvas
const s3 = 'if(!je)return jsxs("div",{style:{color:"#ccc"},children:["loading ",ze.toFixed(1),"%"]});';
const r3 = 'if(!1&&!je)return jsxs("div",{style:{color:"#ccc"},children:["loading ",ze.toFixed(1),"%"]});';
if (code.includes(s3)) {
  code = code.replace(s3, r3);
  modified = true;
  console.log('[patch-sdk] Successfully bypassed loading 0% overlay.');
} else if (code.includes(r3)) {
  console.log('[patch-sdk] Loading overlay bypass already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find loading overlay pattern.');
}

if (modified) {
  fs.writeFileSync(targetPath, code, 'utf8');
  console.log('[patch-sdk] All patches successfully applied to video-core-sdk.js.');
} else {
  console.log('[patch-sdk] No changes needed (already up to date).');
}

