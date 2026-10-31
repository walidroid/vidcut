const fs = require('fs');

// 1. CreditRecharge.tsx
let f1 = fs.readFileSync('src/pages/editor/components/header/CreditRecharge.tsx', 'utf8');
f1 = f1.replace('积分充值', 'Recharge Credits')
       .replace('<span className={styles.wechat}>微</span>', '<span className={styles.wechat}>Pay</span>')
       .replace('<span className={styles.alipay}>支</span>', '');
fs.writeFileSync('src/pages/editor/components/header/CreditRecharge.tsx', f1, 'utf8');

// 2. VipRecharge.tsx
let f2 = fs.readFileSync('src/pages/editor/components/header/VipRecharge.tsx', 'utf8');
f2 = f2.replace('开通会员', 'Subscribe VIP')
       .replace('<span className={styles.wechat}>微</span>', '<span className={styles.wechat}>Pay</span>')
       .replace('<span className={styles.alipay}>支</span>', '');
fs.writeFileSync('src/pages/editor/components/header/VipRecharge.tsx', f2, 'utf8');

// 3. Menus.tsx
let f3 = fs.readFileSync('src/pages/editor/components/options/Menus.tsx', 'utf8');
f3 = f3.replace("name: '基础'", "name: language.val('option_tab_base') || 'Basic'")
       .replace("name: '音频'", "name: language.val('option_tab_audio') || 'Audio'")
       .replace("name: '变速'", "name: language.val('option_speed') || 'Speed'")
       .replace("name: '动画'", "name: language.val('option_tab_animation') || 'Animation'")
       .replace("name: '调节'", "name: language.val('option_adjust') || 'Adjust'");
fs.writeFileSync('src/pages/editor/components/options/Menus.tsx', f3, 'utf8');

// 4. OptionsInner.tsx
let f4 = fs.readFileSync('src/pages/editor/components/options/OptionsInner.tsx', 'utf8');
f4 = f4.replace("description={'类型错误'}", "description={'Invalid Element'}");
fs.writeFileSync('src/pages/editor/components/options/OptionsInner.tsx', f4, 'utf8');

// 5. CropSize.tsx
let f5 = fs.readFileSync('src/pages/editor/components/timeline2/toolbar/CropSize.tsx', 'utf8');
f5 = f5.replace(/>\s*取消\s*</g, '>{language.val("common_cancel") || "Cancel"}<')
       .replace(/>\s*确认\s*</g, '>{language.val("common_confirm") || "Apply"}<');
fs.writeFileSync('src/pages/editor/components/timeline2/toolbar/CropSize.tsx', f5, 'utf8');

// 6. Custom.tsx
let f6 = fs.readFileSync('src/pages/editor/Custom.tsx', 'utf8');
f6 = f6.replace(/>\s*视频时长\s*</g, '>Video Duration<')
       .replace(/>\s*添加图片\s*</g, '>Add Image<')
       .replace(/>\s*添加视频\s*</g, '>Add Video<');
fs.writeFileSync('src/pages/editor/Custom.tsx', f6, 'utf8');

// 7. Captions.tsx
let f7 = fs.readFileSync('src/pages/editor/components/sources/caption/captions/Captions.tsx', 'utf8');
f7 = f7.replace('aria-label="项目操作按钮组"', 'aria-label="Actions"')
       .replace(/>\s*确定\s*</g, '>{language.val("common_confirm") || "Confirm"}<');
fs.writeFileSync('src/pages/editor/components/sources/caption/captions/Captions.tsx', f7, 'utf8');

// 8. Clean commented out Chinese in Footer, Header, ContextMenus, ItemStatusBtn
let footer = fs.readFileSync('src/components/footer/Footer.tsx', 'utf8');
footer = footer.replace(/\{\/\*[\s\S]*?VIP特权[\s\S]*?\*\/\}/g, '')
               .replace(/\{\/\*[\s\S]*?董经理[\s\S]*?\*\/\}/g, '')
               .replace(/\{\/\*[\s\S]*?开启cookie提供更好的服务[\s\S]*?\*\/\}/g, '');
fs.writeFileSync('src/components/footer/Footer.tsx', footer, 'utf8');

let header = fs.readFileSync('src/components/header/Header.tsx', 'utf8');
header = header.replace(/\{\/\*[\s\S]*?会员中心[\s\S]*?\*\/\}/g, '');
fs.writeFileSync('src/components/header/Header.tsx', header, 'utf8');

let contextMenus = fs.readFileSync('src/pages/editor/components/canvas/ContextMenus.tsx', 'utf8');
contextMenus = contextMenus.replace(/\{\/\*[\s\S]*?打散[\s\S]*?\*\/\}/g, '');
fs.writeFileSync('src/pages/editor/components/canvas/ContextMenus.tsx', contextMenus, 'utf8');

let itemStatusBtn = fs.readFileSync('src/pages/workspace/product/ItemStatusBtn.tsx', 'utf8');
itemStatusBtn = itemStatusBtn.replace(/\{\/\*[\s\S]*?去编辑[\s\S]*?\*\/\}/g, '')
                             .replace(/\{\/\*[\s\S]*?失败\/重试[\s\S]*?\*\/\}/g, '');
fs.writeFileSync('src/pages/workspace/product/ItemStatusBtn.tsx', itemStatusBtn, 'utf8');

let editorHeader = fs.readFileSync('src/pages/editor/components/header/Header.tsx', 'utf8');
editorHeader = editorHeader.replace(/\{\/\*[\s\S]*?开通VIP[\s\S]*?\*\/\}/g, '')
                           .replace(/\{\/\*[\s\S]*?编辑模式切换[\s\S]*?\*\/\}/g, '');
fs.writeFileSync('src/pages/editor/components/header/Header.tsx', editorHeader, 'utf8');

// 9. CropUpload.tsx
let cropUpload = fs.readFileSync('src/layout/user-layout/sidebar/cropUpload/CropUpload.tsx', 'utf8');
cropUpload = cropUpload.replace("Toast.success('头像上传失败');", "Toast.error('Avatar upload failed');")
                       .replace("Toast.success('头像更新失败');", "Toast.error('Avatar update failed');")
                       .replace("Toast.success('头像修改成功');", "Toast.success('Avatar updated successfully');");
fs.writeFileSync('src/layout/user-layout/sidebar/cropUpload/CropUpload.tsx', cropUpload, 'utf8');

// 10. Add option_adjust to language files if not present
const enFile = 'src/language/enUS.ts';
let enContent = fs.readFileSync(enFile, 'utf8');
if (!enContent.includes('option_adjust:')) {
  enContent = enContent.replace(/\n\};?\s*$/, "\n  option_adjust: 'Adjust',\n};");
  fs.writeFileSync(enFile, enContent, 'utf8');
}

const frFile = 'src/language/frFR.ts';
let frContent = fs.readFileSync(frFile, 'utf8');
if (!frContent.includes('option_adjust:')) {
  frContent = frContent.replace(/\n\};?\s*$/, "\n  option_adjust: 'Ajuster',\n};");
  fs.writeFileSync(frFile, frContent, 'utf8');
}

const arFile = 'src/language/arSA.ts';
let arContent = fs.readFileSync(arFile, 'utf8');
if (!arContent.includes('option_adjust:')) {
  arContent = arContent.replace(/\n\};?\s*$/, "\n  option_adjust: 'ضبط',\n};");
  fs.writeFileSync(arFile, arContent, 'utf8');
}

console.log('[precision-fix] Done.');

