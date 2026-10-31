const fs = require('fs');

// 1. LutFilter.tsx line 140
let lut = fs.readFileSync('src/pages/editor/components/options/components/colour/LutFilter.tsx', 'utf8');
lut = lut.replace(/>\s*移除滤镜\s*</g, '>{language.val("option_filter_remove") || "Remove Filter"}<');
fs.writeFileSync('src/pages/editor/components/options/components/colour/LutFilter.tsx', lut, 'utf8');

// 2. EChart.tsx
let ech = fs.readFileSync('src/pages/editor/components/options/components/echart/EChart.tsx', 'utf8');
ech = ech.replace('title="图表类型"', 'title="Chart Type"')
         .replace(/>\s*导入Excel\s*</g, '>Import Excel<')
         .replace(/>\s*样例数据\s*</g, '>Sample Data<');
fs.writeFileSync('src/pages/editor/components/options/components/echart/EChart.tsx', ech, 'utf8');

// 3. CustomShakeModal.tsx line 195
let csm = fs.readFileSync('src/pages/editor/components/options/components/element-data/CustomShakeModal.tsx', 'utf8');
csm = csm.replace(/>\s*预览\s*</g, '>Preview<');
fs.writeFileSync('src/pages/editor/components/options/components/element-data/CustomShakeModal.tsx', csm, 'utf8');

// 4. ImageData.tsx
let imgd = fs.readFileSync('src/pages/editor/components/options/components/ImageData.tsx', 'utf8');
imgd = imgd.replace("Toast.success('console查看');", "Toast.success('Inspect data in console');")
           .replace("title: '数据',", "title: 'Element Data',");
fs.writeFileSync('src/pages/editor/components/options/components/ImageData.tsx', imgd, 'utf8');

// 5. Animation.tsx
let anim = fs.readFileSync('src/pages/editor/components/options/components/animation/Animation.tsx', 'utf8');
anim = anim.replace("throw new Error('未知类型');", "throw new Error('Unknown type');")
           .replace("throw new Error('类型错误');", "throw new Error('Type error');");
fs.writeFileSync('src/pages/editor/components/options/components/animation/Animation.tsx', anim, 'utf8');

// 6. BlendMode.tsx
let bm = fs.readFileSync('src/pages/editor/components/options/components/blendMode/BlendMode.tsx', 'utf8');
const bmComment = `/**
 * PIXI Blend Modes reference:
 * NORMAL, ADD, MULTIPLY, SCREEN, NONE, DST_IN, DST_OUT, SUBTRACT
 */`;
bm = bm.replace(/\/\*\*[\s\S]*?LUMINOSITY（明度）\s*\*\//, bmComment);
fs.writeFileSync('src/pages/editor/components/options/components/blendMode/BlendMode.tsx', bm, 'utf8');

// 7. Remove commented-out curve speed in speed components
let sp1 = fs.readFileSync('src/pages/editor/components/options/components/speed/Speed.tsx', 'utf8');
sp1 = sp1.replace(/\{\/\*\s*<Item title="曲线变速">[\s\S]*?<\/Item>\s*\*\/\}/, '');
fs.writeFileSync('src/pages/editor/components/options/components/speed/Speed.tsx', sp1, 'utf8');

let sp2 = fs.readFileSync('src/pages/editor/components/options/components/apng-speed/Speed.tsx', 'utf8');
sp2 = sp2.replace(/\{\/\*\s*<Item title="曲线变速">[\s\S]*?<\/Item>\s*\*\/\}/, '');
fs.writeFileSync('src/pages/editor/components/options/components/apng-speed/Speed.tsx', sp2, 'utf8');

console.log('[final-cleanup] Successfully finished.');

