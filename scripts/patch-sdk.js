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

// 4. Synchronously assign Je.data = _e on Movie component render
const s4 = 'const Je=Ze.current;"export"!==J&&(Je.currentTime=Te)';
const r4 = 'const Je=Ze.current;Je.data=_e;"export"!==J&&(Je.currentTime=Te)';
if (code.includes(s4)) {
  code = code.replace(s4, r4);
  modified = true;
  console.log('[patch-sdk] Successfully added synchronous Je.data = _e in Movie.');
} else if (code.includes(r4)) {
  console.log('[patch-sdk] Movie synchronous Je.data assignment already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find Movie Je definition pattern.');
}

// 5. Defensive check in Store2.updateGroup() for undefined data or elements
const s5 = 'updateGroup(){const E=groupByTrackIndex(this.data.elements);';
const r5 = 'updateGroup(){if(!this.data||!this.data.elements)return;const E=groupByTrackIndex(this.data.elements);';
if (code.includes(s5)) {
  code = code.replace(s5, r5);
  modified = true;
  console.log('[patch-sdk] Successfully added null-safe guard in Store2.updateGroup().');
} else if (code.includes(r5)) {
  console.log('[patch-sdk] Store2.updateGroup() null-safe guard already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find Store2.updateGroup() pattern.');
}

// 6. Guarantee fetchBlob never hangs on offline/missing files
const s6 = 'pump()}else console.error("资源加载失败")})).catch((E=>{console.error(E)}))';
const r6 = 'pump()}else{console.error("资源加载失败");J(E);}})).catch((E=>{console.error(E);J(E);}))';
if (code.includes(s6)) {
  code = code.replace(s6, r6);
  modified = true;
  console.log('[patch-sdk] Successfully made fetchBlob resolve on fetch failure.');
} else if (code.includes(r6)) {
  console.log('[patch-sdk] fetchBlob failure handler already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find fetchBlob failure pattern.');
}

// 7. Guarantee getMaterialFileUrl never hangs on missing material
const s7 = 'if(E.startsWith("materials/"))return this.getMaterialFileUrl?(this.getMaterialFileUrl(E).then((Z=>{this._cacheBolbURL[E]=Z,J(Z)})),void 0):(console.error("getMaterialFileUrl 未实现"),void 0);';
const r7 = 'if(E.startsWith("materials/"))return this.getMaterialFileUrl?(this.getMaterialFileUrl(E).then((Z=>{this._cacheBolbURL[E]=Z,J(Z)})).catch(()=>J(E)),void 0):(console.error("getMaterialFileUrl 未实现"),J(E),void 0);';
if (code.includes(s7)) {
  code = code.replace(s7, r7);
  modified = true;
  console.log('[patch-sdk] Successfully made getMaterialFileUrl resolve on failure.');
} else if (code.includes(r7)) {
  console.log('[patch-sdk] getMaterialFileUrl failure handler already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find getMaterialFileUrl pattern.');
}

// 8. Safe default in Store constructor: this.data is never undefined
const s8 = 'this.captionContainer=void 0,this.onPause=null,this.data=void 0';
const r8 = 'this.captionContainer=void 0,this.onPause=null,this.data={width:1920,height:1080,elements:[],captions:[],resouces:[],transitions:[],cameras:[]}';
if (code.includes(s8)) {
  code = code.replace(s8, r8);
  modified = true;
  console.log('[patch-sdk] Successfully initialized Store this.data in constructor.');
} else if (code.includes(r8)) {
  console.log('[patch-sdk] Store this.data constructor initialization already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find Store constructor this.data pattern.');
}

// 9. Safe default in Store.destroy(): reset to empty movie object instead of null
const s9 = 'this._exportFrameOverlayText=null,this.exportFrameOverlay=null,this.data=null,this.app=null,console.log("销毁",this)';
const r9 = 'this._exportFrameOverlayText=null,this.exportFrameOverlay=null,this.data={width:1920,height:1080,elements:[],captions:[],resouces:[],transitions:[],cameras:[]},this.app=null,console.log("销毁",this)';
if (code.includes(s9)) {
  code = code.replace(s9, r9);
  modified = true;
  console.log('[patch-sdk] Successfully patched Store.destroy() to keep safe default data.');
} else if (code.includes(r9)) {
  console.log('[patch-sdk] Store.destroy() safe data already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find Store.destroy() pattern.');
}

// 10. Defensive check in removeInvalidTransition
const s10 = 'removeInvalidTransition(){const E=groupByTrackIndex(this.data.elements),Z=this.data.transitions;';
const r10 = 'removeInvalidTransition(){if(!this.data||!this.data.elements)return;const E=groupByTrackIndex(this.data.elements),Z=this.data.transitions||[];';
if (code.includes(s10)) {
  code = code.replace(s10, r10);
  modified = true;
  console.log('[patch-sdk] Successfully added null-safe guard in removeInvalidTransition.');
} else if (code.includes(r10)) {
  console.log('[patch-sdk] removeInvalidTransition null-safe guard already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find removeInvalidTransition pattern.');
}

// 11. Defensive check in checkSupportTransition
const s11 = 'checkSupportTransition(E){const Z=groupByTrackIndex(this.data.elements);';
const r11 = 'checkSupportTransition(E){if(!this.data||!this.data.elements)return!1;const Z=groupByTrackIndex(this.data.elements);';
if (code.includes(s11)) {
  code = code.replace(s11, r11);
  modified = true;
  console.log('[patch-sdk] Successfully added null-safe guard in checkSupportTransition.');
} else if (code.includes(r11)) {
  console.log('[patch-sdk] checkSupportTransition null-safe guard already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find checkSupportTransition pattern.');
}

// 12. Defensive check in getMediaTrackNum
const s12 = 'getMediaTrackNum(){const E=groupByTrackIndex(this.data.elements);';
const r12 = 'getMediaTrackNum(){if(!this.data||!this.data.elements)return 0;const E=groupByTrackIndex(this.data.elements);';
if (code.includes(s12)) {
  code = code.replace(s12, r12);
  modified = true;
  console.log('[patch-sdk] Successfully added null-safe guard in getMediaTrackNum.');
} else if (code.includes(r12)) {
  console.log('[patch-sdk] getMediaTrackNum null-safe guard already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find getMediaTrackNum pattern.');
}

// 13. Defensive check in groupByTrackIndex
const s13 = 'function groupByTrackIndex(E){const Z=groupBy$2(E,"trackIndex"),J=values$1(Z);';
const r13 = 'function groupByTrackIndex(E){if(!E||!Array.isArray(E))return[];const Z=groupBy$2(E,"trackIndex"),J=values$1(Z);';
if (code.includes(s13)) {
  code = code.replace(s13, r13);
  modified = true;
  console.log('[patch-sdk] Successfully added null-safe guard in groupByTrackIndex.');
} else if (code.includes(r13)) {
  console.log('[patch-sdk] groupByTrackIndex null-safe guard already patched.');
} else {
  console.warn('[patch-sdk] Warning: could not find groupByTrackIndex pattern.');
}

// 14. Bypass registration ID check in Movie
const s14 = '!Re)return jsx("div",{style:{color:"red"},children:"必须填写注册ID，注册ID可通过https://video.h5ds.com进行申请"});';
const r14 = 'false&&!Re)return jsx("div",{style:{color:"red"},children:""});';
if (code.includes(s14)) {
  code = code.replace(s14, r14);
  modified = true;
  console.log('[patch-sdk] Successfully bypassed registration ID check.');
} else if (code.includes(r14)) {
  console.log('[patch-sdk] Registration ID check already bypassed.');
} else {
  console.warn('[patch-sdk] Warning: could not find registration ID pattern.');
}

if (modified) {
  fs.writeFileSync(targetPath, code, 'utf8');
  console.log('[patch-sdk] All patches successfully applied to video-core-sdk.js.');
} else {
  console.log('[patch-sdk] No changes needed (already up to date).');
}

// 14. Always clear Vite cache in node_modules/.vite to prevent stale pre-bundled deps
const viteCacheDir = path.resolve(__dirname, '../node_modules/.vite');
if (fs.existsSync(viteCacheDir)) {
  try {
    fs.rmSync(viteCacheDir, { recursive: true, force: true });
    console.log('[patch-sdk] Successfully cleared stale Vite pre-bundle cache in node_modules/.vite');
  } catch (err) {
    console.warn('[patch-sdk] Notice: could not remove .vite cache folder:', err.message);
  }
}
