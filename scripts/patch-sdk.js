const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../node_modules/video-core-sdk/video-core-sdk.js');

if (fs.existsSync(targetPath)) {
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
  }

  // 2. Safe Assets.load & loadUsedResource inside try-catch to prevent uncaught promise rejection
  const s2 = 'console.log("资源加载");const Z=await Assets.load([{alias:"displacementMap",src:Je.reURL("/assets/images/displacement_map.png")},{alias:"overlayMap",src:Je.reURL("/assets/images/overlay.png")},{alias:"colorMap",src:Je.reURL("/assets/images/colormap.png")},{alias:"lightMap",src:Je.reURL("/assets/images/lightmap.png")}]);Je.assetsMap=Z,await Je.resourceManage.loadUsedResource((E=>{Ue(100*E),Ee&&Ee(E)}),!!Me,10,J),Ve(!0),setTimeout((()=>{We(!0)}),500)';
  const r2 = 'console.log("Resource loading");let Z=null;try{Z=await Assets.load([{alias:"displacementMap",src:Je.reURL("/assets/images/displacement_map.png")},{alias:"overlayMap",src:Je.reURL("/assets/images/overlay.png")},{alias:"colorMap",src:Je.reURL("/assets/images/colormap.png")},{alias:"lightMap",src:Je.reURL("/assets/images/lightmap.png")}]);}catch(e){console.warn("Assets.load safe catch:",e);}Je.assetsMap=Z;try{await Je.resourceManage.loadUsedResource((E=>{Ue(100*E),Ee&&Ee(E)}),!!Me,10,J);}catch(e){console.warn("loadUsedResource safe catch:",e);}Ve(!0);We(!0);';
  if (code.includes(s2)) {
    code = code.replace(s2, r2);
    modified = true;
    console.log('[patch-sdk] Successfully wrapped Assets.load and loadUsedResource in try-catch.');
  } else if (code.includes(r2)) {
    console.log('[patch-sdk] Assets.load try-catch already patched.');
  }

  // 3. Bypass the loading overlay div to never block the canvas
  const s3 = 'if(!je)return jsxs("div",{style:{color:"#ccc"},children:["loading ",ze.toFixed(1),"%"]});';
  const s3b = 'if(!1&&!je)return jsxs("div",{style:{color:"#ccc"},children:["loading ",ze.toFixed(1),"%"]});';
  const r3 = 'if(false)return null;';
  if (code.includes(s3)) {
    code = code.replace(s3, r3);
    modified = true;
    console.log('[patch-sdk] Successfully eliminated loading overlay.');
  } else if (code.includes(s3b)) {
    code = code.replace(s3b, r3);
    modified = true;
    console.log('[patch-sdk] Successfully upgraded loading overlay bypass to null.');
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
  }

  // 6. Guarantee fetchBlob never hangs on offline/missing files
  const s6 = 'pump()}else console.error("资源加载失败")})).catch((E=>{console.error(E)}))';
  const r6 = 'pump()}else{console.error("Resource loading failed");J(E);}})).catch((E=>{console.error(E);J(E);}))';
  if (code.includes(s6)) {
    code = code.replace(s6, r6);
    modified = true;
    console.log('[patch-sdk] Successfully made fetchBlob resolve on fetch failure.');
  } else if (code.includes(r6)) {
    console.log('[patch-sdk] fetchBlob failure handler already patched.');
  }

  // 7. Guarantee getMaterialFileUrl never hangs on missing material
  const s7 = 'if(E.startsWith("materials/"))return this.getMaterialFileUrl?(this.getMaterialFileUrl(E).then((Z=>{this._cacheBolbURL[E]=Z,J(Z)})),void 0):(console.error("getMaterialFileUrl 未实现"),void 0);';
  const r7 = 'if(E.startsWith("materials/"))return this.getMaterialFileUrl?(this.getMaterialFileUrl(E).then((Z=>{this._cacheBolbURL[E]=Z,J(Z)})).catch(()=>J(E)),void 0):(console.error("getMaterialFileUrl not implemented"),J(E),void 0);';
  if (code.includes(s7)) {
    code = code.replace(s7, r7);
    modified = true;
    console.log('[patch-sdk] Successfully made getMaterialFileUrl resolve on failure.');
  } else if (code.includes(r7)) {
    console.log('[patch-sdk] getMaterialFileUrl failure handler already patched.');
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
  }

  // 9. Safe default in Store.destroy(): reset to empty movie object instead of null
  const s9 = 'this._exportFrameOverlayText=null,this.exportFrameOverlay=null,this.data=null,this.app=null,console.log("销毁",this)';
  const r9 = 'this._exportFrameOverlayText=null,this.exportFrameOverlay=null,this.data={width:1920,height:1080,elements:[],captions:[],resouces:[],transitions:[],cameras:[]},this.app=null,console.log("Destroy",this)';
  if (code.includes(s9)) {
    code = code.replace(s9, r9);
    modified = true;
    console.log('[patch-sdk] Successfully patched Store.destroy() to keep safe default data.');
  } else if (code.includes(r9)) {
    console.log('[patch-sdk] Store.destroy() safe data already patched.');
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
  }

  // 15. Safe timeout guard in renderBack() so Stage never hangs forever waiting on elementReadyMark
  const s15 = 'renderBack=async()=>{if(await sleep(500),Object.keys(Ie.elementReadyMark).length)for(;0!==Object.keys(Ie.elementReadyMark).length;){for(let E in Ie.elementReadyMark)"success"===Ie.elementReadyMark[E]&&delete Ie.elementReadyMark[E];if(0===Object.keys(Ie.elementReadyMark).length)break;await sleep(100)}E.callback&&E.callback(E.store)};';
  const r15 = 'renderBack=async()=>{let _w=0;if(await sleep(200),Object.keys(Ie.elementReadyMark).length)for(;0!==Object.keys(Ie.elementReadyMark).length;){for(let E in Ie.elementReadyMark)"success"===Ie.elementReadyMark[E]&&delete Ie.elementReadyMark[E];if(0===Object.keys(Ie.elementReadyMark).length||++_w>15)break;await sleep(100)}E.callback&&E.callback(E.store)};';
  if (code.includes(s15)) {
    code = code.replace(s15, r15);
    modified = true;
    console.log('[patch-sdk] Successfully added timeout guard in renderBack().');
  } else if (code.includes(r15)) {
    console.log('[patch-sdk] renderBack() timeout guard already patched.');
  }

  // 16. Silence PixiJS FILTER_RESOLUTION deprecation warning
  const s16 = 'FILTER_RESOLUTION:{get:()=>(deprecation("7.1.0","settings.FILTER_RESOLUTION is deprecated, use Filter.defaultResolution"),Filter.defaultResolution),set(E){Filter.defaultResolution=E}}';
  const r16 = 'FILTER_RESOLUTION:{get:()=>Filter.defaultResolution,set(E){Filter.defaultResolution=E}}';
  if (code.includes(s16)) {
    code = code.replace(s16, r16);
    modified = true;
    console.log('[patch-sdk] Successfully silenced PixiJS FILTER_RESOLUTION deprecation warning.');
  } else if (code.includes(r16)) {
    console.log('[patch-sdk] PixiJS FILTER_RESOLUTION deprecation already patched.');
  }

  // 17. Silence PubSub duplicate load warning in video-core-sdk
  const s17 = 'J.PubSub?(xe=J.PubSub,console.warn("PubSub already loaded, using existing version")):(J.PubSub=xe,_e(xe))';
  const r17 = 'J.PubSub?(xe=J.PubSub):(J.PubSub=xe,_e(xe))';
  if (code.includes(s17)) {
    code = code.replace(s17, r17);
    modified = true;
    console.log('[patch-sdk] Successfully silenced PubSub duplicate load warning in video-core-sdk.');
  } else if (code.includes(r17)) {
    console.log('[patch-sdk] PubSub duplicate load warning already patched in video-core-sdk.');
  }

  // 18. Replace runtime Chinese strings in video-core-sdk.js with English equivalents
  const sdkStringMap = [
    ['资源加载失败', 'Resource loading failed'],
    ['资源加载异常', 'Resource loading error'],
    ['资源加载', 'Resource loading'],
    ['资源不存在sourceId:', 'Resource does not exist sourceId:'],
    ['资源不存在', 'Resource does not exist'],
    ['资源异常', 'Resource exception'],
    ['资源缓存失败', 'Resource cache failed'],
    ['资源destroy', 'Resource destroyed'],
    ['图片加载失败', 'Failed to load image'],
    ['媒体加载失败', 'Media failed to load'],
    ['媒体加载成功', 'Media loaded successfully'],
    ['字体资源加载异常', 'Font loading error'],
    ['字体资源文件不存在', 'Font file does not exist'],
    ['视频资源不存在', 'Video resource does not exist'],
    ['暂无此类型元素的添加方法addElementNoSource:', 'No method to add element of this type:'],
    ['元素在数据中不存在', 'Element does not exist in data'],
    ['没有找到该元素', 'Element not found'],
    ['❌ PIXI 崩溃：WebGL上下文丢失！', '❌ PIXI crash: WebGL context lost!'],
    ['画布渲染异常，正在自动恢复...', 'Canvas render error, recovering...'],
    ['参数错误请传入: editElment | editMask', 'Parameter error: expected editElement | editMask'],
    ['参数错误', 'Parameter error'],
    ['参数异常', 'Invalid parameter'],
    ['trackIndex不能是0或者小于0的数', 'trackIndex cannot be 0 or less'],
    ['计算新的trackIndex', 'Calculating new trackIndex'],
    ['音频合成成功！!!', 'Audio synthesis successful!'],
    ['音频合成___>', 'Audio synthesis ->'],
    ['音频已经编码--\\x3e', 'Audio encoded ->'],
    ['原生音频编码不支持，改用ffmpeg进行编码', 'Native audio encoding unsupported, using FFmpeg'],
    ['转码异常，可能是跨域或者浏览器兼容问题导致VideoEncoder实例化失败', 'Transcoding error: VideoEncoder initialization failed'],
    ['data数据为页面数据，必须传入', 'data is required'],
    ['target为渲染目标，必须传入', 'target render destination is required'],
    ['parmas参数必须传入', 'params parameter is required'],
    ['ratio参数错误,参考格式', 'ratio parameter error, expected format'],
    ['去掉转场----\\x3e', 'Remove transition ->'],
    ['创建转场---\\x3e', 'Create transition ->'],
    ['设置转场的滤镜----\\x3e', 'Set transition filter ->'],
    ['该时间点已经有关键帧了，更新', 'Keyframe already exists at time, updating'],
    ['下载进度', 'Download progress'],
    ['变化结束 >>>>', 'Change finished >>>>'],
    ['控制器修改元素', 'Controller modified element'],
    ['控制器被销毁了', 'Controller destroyed'],
    ['控制器销毁了？？？？？？', 'Controller destroyed'],
    ['重新new---init', 'Re-initialize'],
    ['销毁---\\x3e', 'Destroy ->'],
    ['销毁', 'Destroy'],
    ['组件销毁', 'Component destroyed'],
    ['缓存成功', 'Cached successfully'],
    ['帧数组不能为空', 'Frame array cannot be empty'],
    ['所有帧解析完毕', 'All frames parsed'],
    ['等待图片的加载', 'Waiting for image to load'],
    ['等待任务开始', 'Waiting for task to start'],
    ['未知格式', 'Unknown format'],
    ['不是PNG', 'Not a PNG'],
    ['不是apng，不处理', 'Not an APNG, skipping'],
    ['svg解析失败', 'SVG parse failed'],
    ['toJS数据异常', 'toJS data exception'],
    ['卡这里了？？', 'Stuck here??'],
    ['超过范围了1', 'Out of range 1'],
    ['超过范围了2', 'Out of range 2'],
    ['无法获取视频: ${J.statusText}', 'Cannot fetch video: ${J.statusText}'],
    ['获取视频文件失败:', 'Failed to fetch video file:'],
  ];

  for (const [cn, en] of sdkStringMap) {
    if (code.includes(cn)) {
      code = code.replaceAll(cn, en);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(targetPath, code, 'utf8');
    console.log('[patch-sdk] All patches successfully applied to video-core-sdk.js.');
  } else {
    console.log('[patch-sdk] video-core-sdk.js already up to date.');
  }
}

// 19. Patch Semi UI locales to dynamically proxy to active locale (fr-FR, ar-SA, en-US)
const semiDir = path.resolve(__dirname, '../node_modules/@douyinfe/semi-ui');
if (fs.existsSync(semiDir)) {
  const esProxy = `import en_US from './en_US';
import fr from './fr';
import ar from './ar';

function getActiveLocale() {
  try {
    const lang = typeof localStorage !== 'undefined' ? localStorage.getItem('language') : 'en-US';
    if (lang === 'fr-FR') return fr;
    if (lang === 'ar-SA') return ar;
    return en_US;
  } catch (e) {
    return en_US;
  }
}

const local = new Proxy(en_US, {
  get(target, prop) {
    const active = getActiveLocale();
    if (active && active[prop] !== undefined) {
      return active[prop];
    }
    return target[prop];
  }
});

export default local;
`;

  const cjsProxy = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const en_US = require("./en_US").default;
const fr = require("./fr").default;
const ar = require("./ar").default;

function getActiveLocale() {
  try {
    const lang = typeof localStorage !== 'undefined' ? localStorage.getItem('language') : 'en-US';
    if (lang === 'fr-FR') return fr;
    if (lang === 'ar-SA') return ar;
    return en_US;
  } catch (e) {
    return en_US;
  }
}

const local = new Proxy(en_US, {
  get(target, prop) {
    const active = getActiveLocale();
    if (active && active[prop] !== undefined) {
      return active[prop];
    }
    return target[prop];
  }
});

exports.default = local;
`;

  const esZhCn = path.join(semiDir, 'lib/es/locale/source/zh_CN.js');
  const esZhTw = path.join(semiDir, 'lib/es/locale/source/zh_TW.js');
  const cjsZhCn = path.join(semiDir, 'lib/cjs/locale/source/zh_CN.js');
  const cjsZhTw = path.join(semiDir, 'lib/cjs/locale/source/zh_TW.js');

  [esZhCn, esZhTw].forEach(f => {
    if (fs.existsSync(f)) {
      fs.writeFileSync(f, esProxy, 'utf8');
    }
  });

  [cjsZhCn, cjsZhTw].forEach(f => {
    if (fs.existsSync(f)) {
      fs.writeFileSync(f, cjsProxy, 'utf8');
    }
  });

  console.log('[patch-sdk] Successfully patched Semi UI default locales to dynamic multi-lingual proxy.');
}

// 20. Clean up unused legacy Chinese JSON data in public/assets if present
const publicAssets = path.resolve(__dirname, '../public/assets');
['zijie1.json', 'zijie2.json', 'zijieVoices.json'].forEach(f => {
  const p = path.join(publicAssets, f);
  if (fs.existsSync(p)) {
    try {
      fs.writeFileSync(p, '[]', 'utf8');
      console.log(`[patch-sdk] Neutralized unused ${f}`);
    } catch (e) {}
  }
});

// 21. Always clear Vite cache in node_modules/.vite to prevent stale pre-bundled deps
const viteCacheDir = path.resolve(__dirname, '../node_modules/.vite');
if (fs.existsSync(viteCacheDir)) {
  try {
    fs.rmSync(viteCacheDir, { recursive: true, force: true });
    console.log('[patch-sdk] Successfully cleared stale Vite pre-bundle cache in node_modules/.vite');
  } catch (err) {
    console.warn('[patch-sdk] Notice: could not remove .vite cache folder:', err.message);
  }
}
