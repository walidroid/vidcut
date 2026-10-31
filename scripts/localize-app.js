const fs = require('fs');
const path = require('path');

function replaceInFile(relPath, replacements) {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn('[localize] File not found:', relPath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let count = 0;
  for (const [target, replacement] of replacements) {
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
      count++;
    }
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`[localize] ${relPath}: ${count} replacements.`);
}

// 1. Language files enrichment
const newEnKeys = `
  user_not_active: 'Inactive',
  user_id: 'User ID',
  user_vip_member: 'VIP Member',
  user_upgrade_vip: 'Subscribe VIP',
  user_valid_until: 'Valid until',
  user_free_user: 'Standard User',
  user_recharge_credits: 'Recharge Credits',
  canvas_drag: 'Pan Canvas',
  canvas_select: 'Select Element',
  canvas_fit: 'Fit to Screen',
  timeline_top_add_camera: 'Add Camera',
  timeline_no_audio: 'Video has no audio track',
  common_replace: 'Replace',
  common_operation_frequent: 'Operation too frequent',
  common_material_unavailable: 'Material unavailable',
  tpl_no_elements: 'No replaceable elements',
  tpl_drag_replace: 'Drag element here to replace',
  tpl_click_edit: 'Click to edit text',
  tpl_edit_text: 'Edit Text',
  option_disable_animation: 'Disable Animation',
  option_filter_basic: 'Basic Filter',
  option_filter_lut: 'LUT Filter',
  option_filter_remove: 'Remove Filter',
  option_custom_animation: 'Custom Animation',
  option_no_animation: 'None',
};`;

const newFrKeys = `
  user_not_active: 'Inactif',
  user_id: 'ID Utilisateur',
  user_vip_member: 'Membre VIP',
  user_upgrade_vip: 'S\\'abonner au VIP',
  user_valid_until: 'Valable jusqu\\'au',
  user_free_user: 'Utilisateur Standard',
  user_recharge_credits: 'Recharger des crédits',
  canvas_drag: 'Déplacer la zone',
  canvas_select: 'Sélectionner l\\'élément',
  canvas_fit: 'Ajuster à l\\'écran',
  timeline_top_add_camera: 'Ajouter une caméra',
  timeline_no_audio: 'La vidéo n\\'a pas de piste audio',
  common_replace: 'Remplacer',
  common_operation_frequent: 'Opération trop fréquente',
  common_material_unavailable: 'Média indisponible',
  tpl_no_elements: 'Aucun élément remplaçable',
  tpl_drag_replace: 'Glisser un élément pour remplacer',
  tpl_click_edit: 'Cliquer pour modifier le texte',
  tpl_edit_text: 'Modifier le texte',
  option_disable_animation: 'Désactiver l\\'animation',
  option_filter_basic: 'Filtre de base',
  option_filter_lut: 'Filtre LUT',
  option_filter_remove: 'Supprimer le filtre',
  option_custom_animation: 'Animation personnalisée',
  option_no_animation: 'Aucune',
};`;

const newArKeys = `
  user_not_active: 'غير مفعل',
  user_id: 'معرف المستخدم',
  user_vip_member: 'عضو VIP',
  user_upgrade_vip: 'الاشتراك في VIP',
  user_valid_until: 'صالح حتى',
  user_free_user: 'مستخدم عادي',
  user_recharge_credits: 'شحن الرصيد',
  canvas_drag: 'تحريك لوحة العمل',
  canvas_select: 'تحديد العنصر',
  canvas_fit: 'ملائمة الشاشة',
  timeline_top_add_camera: 'إضافة كاميرا',
  timeline_no_audio: 'الفيديو لا يحتوي على مسار صوتي',
  common_replace: 'استبدال',
  common_operation_frequent: 'العمليات متكررة جداً',
  common_material_unavailable: 'المورد غير متوفر',
  tpl_no_elements: 'لا توجد عناصر قابلة للاستبدال',
  tpl_drag_replace: 'اسحب عنصراً هنا للاستبدال',
  tpl_click_edit: 'انقر لتعديل النص',
  tpl_edit_text: 'تعديل النص',
  option_disable_animation: 'تعطيل الحركة',
  option_filter_basic: 'مرشح أساسي',
  option_filter_lut: 'مرشح LUT',
  option_filter_remove: 'إزالة المرشح',
  option_custom_animation: 'حركة مخصصة',
  option_no_animation: 'بدون حركة',
};`;

['src/language/enUS.ts', 'src/language/frFR.ts', 'src/language/arSA.ts'].forEach(file => {
  const full = path.resolve(__dirname, '..', file);
  let c = fs.readFileSync(full, 'utf8');
  if (!c.includes('user_not_active:')) {
    const repl = file.includes('enUS') ? newEnKeys : (file.includes('frFR') ? newFrKeys : newArKeys);
    c = c.replace(/\n\};?\s*$/, repl);
    fs.writeFileSync(full, c, 'utf8');
    console.log(`[localize] Appended new keys to ${file}`);
  }
});

// 2. User.tsx
replaceInFile('src/pages/editor/components/header/User.tsx', [
  ["const vipExpire = info.vip_expire ? util.formatDate(info.vip_expire, 'YYYY-MM-DD') : '未开通';", "const vipExpire = info.vip_expire ? util.formatDate(info.vip_expire, 'YYYY-MM-DD') : (language.val('user_not_active') || 'Inactive');"],
  ['<em>用户ID: </em>', "<em>{language.val('user_id') || 'User ID'}: </em>"],
  ["<span>{isVip ? '会员用户' : '开通会员'}</span>", "<span>{isVip ? (language.val('user_vip_member') || 'VIP Member') : (language.val('user_upgrade_vip') || 'Subscribe VIP')}</span>"],
  ["<span className={styles.vipRight}>{isVip ? `有效期至 ${vipExpire}` : '普通用户'}</span>", "<span className={styles.vipRight}>{isVip ? `${language.val('user_valid_until') || 'Valid until'} ${vipExpire}` : (language.val('user_free_user') || 'Standard User')}</span>"],
  ['<span>积分充值</span>', "<span>{language.val('user_recharge_credits') || 'Recharge Credits'}</span>"],
]);

// 3. ReplaceTpl.tsx
replaceInFile('src/pages/editor/components/replace-tpl/ReplaceTpl.tsx', [
  ['{tpls.length === 0 && <div className={styles.noReplace}>暂无可替换元素</div>}', "{tpls.length === 0 && <div className={styles.noReplace}>{language.val('tpl_no_elements') || 'No replaceable elements'}</div>}"],
  ['<span className={styles.tip}>拖入元素替换</span>', "<span className={styles.tip}>{language.val('tpl_drag_replace') || 'Drag element here to replace'}</span>"],
  ['裁剪', "{language.val('common_crop') || 'Crop'}"],
  ['<span className={styles.tip}>点击修改文案</span>', "<span className={styles.tip}>{language.val('tpl_click_edit') || 'Click to edit text'}</span>"],
  ['title="修改文本"', "title={language.val('tpl_edit_text') || 'Edit Text'}"],
]);

// 4. Speed.tsx
replaceInFile('src/pages/editor/components/options/components/apng-speed/Speed.tsx', [
  ['<span style={{ fontSize: 12, marginRight: 5, fontWeight: \'normal\' }}>禁用动画</span>', "<span style={{ fontSize: 12, marginRight: 5, fontWeight: 'normal' }}>{language.val('option_disable_animation') || 'Disable Animation'}</span>"],
  ["desc: '修改播放速度',", "desc: 'Change Playback Speed',"],
]);

// 5. Colour.tsx
replaceInFile('src/pages/editor/components/options/components/colour/Colour.tsx', [
  ['<Radio value="basic">基础滤镜</Radio>', "<Radio value=\"basic\">{language.val('option_filter_basic') || 'Basic Filter'}</Radio>"],
  ['<Radio value="lut">lut滤镜</Radio>', "<Radio value=\"lut\">{language.val('option_filter_lut') || 'LUT Filter'}</Radio>"],
]);

// 6. LutFilter.tsx
replaceInFile('src/pages/editor/components/options/components/colour/LutFilter.tsx', [
  ['title="强度"', "title={language.val('option_strength') || 'Strength'}"],
  ['>移除滤镜<', ">{language.val('option_filter_remove') || 'Remove Filter'}<"],
  ["desc: '应用滤镜',", "desc: 'Apply Filter',"],
  ["desc: '移除滤镜',", "desc: 'Remove Filter',"],
]);

// 7. Background.tsx
replaceInFile('src/pages/editor/components/options/components/background/Background.tsx', [
  ['<h1>\n        背景颜色', "<h1>\n        {language.val('timeline_top_background_color') || 'Background Color'}"],
  ['<h1>\r\n        背景颜色', "<h1>\r\n        {language.val('timeline_top_background_color') || 'Background Color'}"],
]);

// 8. Background colors.ts
replaceInFile('src/pages/editor/components/options/components/background/colors.ts', [
  ["cname: '艺术风格'", "cname: 'Artistic'"],
  ["cname: '海滨风'", "cname: 'Coastal'"],
  ["cname: '冷色'", "cname: 'Cool'"],
  ["cname: '可爱风'", "cname: 'Cute'"],
  ["cname: '优雅范'", "cname: 'Elegant'"],
  ["cname: '华丽风'", "cname: 'Glamour'"],
  ["cname: '中性风'", "cname: 'Neutral'"],
  ["cname: '暖色'", "cname: 'Warm'"],
]);

// 9. echart/colors.ts
replaceInFile('src/pages/editor/components/options/components/echart/colors.ts', [
  ["name: '明亮'", "name: 'Bright'"],
  ["name: '暗淡'", "name: 'Muted'"],
  ["name: '马卡龙'", "name: 'Macaron'"],
  ["name: '蓝绿'", "name: 'Teal'"],
  ["name: '深紫'", "name: 'Deep Purple'"],
  ["name: '复古'", "name: 'Retro'"],
  ["name: '粉青'", "name: 'Pastel'"],
  ["name: '灰粉'", "name: 'Dusty Rose'"],
  ["name: '青草'", "name: 'Grass Green'"],
  ["name: '橘红'", "name: 'Sunset Orange'"],
  ["name: '深色'", "name: 'Dark'"],
  ["name: '罗马红'", "name: 'Roman Red'"],
]);

// 10. Animation.tsx & CustomAnimation.tsx & TextAnimation.tsx
replaceInFile('src/pages/editor/components/options/components/animation/Animation.tsx', [
  ['自定义动画', "{language.val('option_custom_animation') || 'Custom Animation'}"],
  ["name: '无动画'", "name: language.val('option_no_animation') || 'None'"],
  ["desc: '设置动画',", "desc: 'Set Animation',"],
]);

replaceInFile('src/pages/editor/components/options/components/animation/CustomAnimation.tsx', [
  ['<Item title="进度"', '<Item title="Progress"'],
  ['删除此帧', 'Delete Frame'],
  ['<Item title="位置"', '<Item title="Position"'],
  ['<Item title="缩放"', '<Item title="Scale"'],
  ['<Item title="倾斜"', '<Item title="Skew"'],
  ['<Item title="旋转"', '<Item title="Rotation"'],
  ['prefix="圈数"', 'prefix="Turns"'],
  ['prefix="角度"', 'prefix="Angle"'],
  ['<Item title="透明度"', '<Item title="Opacity"'],
]);

replaceInFile('src/pages/editor/components/options/components/animation/TextAnimation.tsx', [
  ["name: '无动画'", "name: language.val('option_no_animation') || 'None'"],
  ["desc: '设置动画',", "desc: 'Set Animation',"],
]);

// 11. StartFrameNumber.tsx
replaceInFile('src/pages/editor/components/options/components/startFrameNumber/StartFrameNumber.tsx', [
  ['循环\n', 'Loop\n'],
  ['循环\r\n', 'Loop\r\n'],
]);

// 12. RecordAudioBox.tsx
replaceInFile('src/pages/editor/components/sources/my/RecordAudioBox.tsx', [
  ['完成\n', 'Complete\n'],
  ['完成\r\n', 'Complete\r\n'],
  ['上传\n', 'Upload\n'],
  ['上传\r\n', 'Upload\r\n'],
]);

// 13. Remaining animateLeave.ts items
replaceInFile('src/pages/editor/components/options/components/animation/animateLeave.ts', [
  ["tips: '左上渐隐'", "tips: 'Fade Out Top Left'"],
  ["tips: '右上渐隐'", "tips: 'Fade Out Top Right'"],
  ["tips: '右下渐隐'", "tips: 'Fade Out Bottom Right'"],
  ["tips: '下后渐隐'", "tips: 'Fade Out Down Back'"],
  ["tips: '左后渐隐'", "tips: 'Fade Out Left Back'"],
  ["tips: '右后渐隐'", "tips: 'Fade Out Right Back'"],
  ["tips: '上后渐隐'", "tips: 'Fade Out Up Back'"],
  ["tips: '弹走'", "tips: 'Bounce Out'"],
  ["tips: '下弹走'", "tips: 'Bounce Down Out'"],
  ["tips: '左弹走'", "tips: 'Bounce Left Out'"],
  ["tips: '右弹走'", "tips: 'Bounce Right Out'"],
  ["tips: '上弹走'", "tips: 'Bounce Up Out'"],
]);

// 14. Qrcode plugin default name
replaceInFile('src/pages/editor/plugins/qrcode/ElementData.tsx', [
  ["name: string = '未命名';", "name: string = 'Untitled';"],
]);

// 15. TrackType.tsx
replaceInFile('src/pages/editor/components/timeline2/tracks/TrackType.tsx', [
  ['title="锁定"', 'title="Lock"'],
  ['title="隐藏/可见"', 'title="Hide/Show"'],
  ['title="吸附"', 'title="Snap"'],
]);

// 16. stores/editor.ts
replaceInFile('src/stores/editor.ts', [
  ["desc: '合并字幕',", "desc: 'Merge Subtitles',"],
  ["Toast.warning('只能和下一个元素进行合并');", "Toast.warning('Can only merge with the next element');"],
  ["Text: '你好，世界哈哈哈。';", "Text: 'Sample Caption Text';"],
  ["desc: '添加字幕',", "desc: 'Add Subtitles',"],
  ["Toast.error('插入时间必须大于1秒');", "Toast.error('Insertion duration must be greater than 1s');"],
]);

// 17. services/localStorageService.ts
replaceInFile('src/services/localStorageService.ts', [
  ["if (!root) throw new Error('未选择本地存储文件夹');", "if (!root) throw new Error('Local storage folder not selected');"],
  ["Toast.error('未选择本地存储文件夹，请刷新页面重试');", "Toast.error('Local storage folder not selected. Please reload and try again.');"],
  ["Toast.error('读取素材文件失败:' + relativePath);", "Toast.error('Failed to read material file: ' + relativePath);"],
  ["if (!record) return [null, '分类不存在'];", "if (!record) return [null, 'Category does not exist'];"],
  ["if (!record) return [null, '项目不存在'];", "if (!record) return [null, 'Project does not exist'];"],
  ["(record.name || 'Untitled') + ' - 副本'", "(record.name || 'Untitled') + ' - Copy'"],
]);

// 18. components/header/user/User.tsx
replaceInFile('src/components/header/user/User.tsx', [
  ["const vipExpire = info.vip_expire ? util.formatDate(info.vip_expire, 'YYYY-MM-DD') : '未开通';", "const vipExpire = info.vip_expire ? util.formatDate(info.vip_expire, 'YYYY-MM-DD') : 'Inactive';"],
]);

// 19. components/not-found/NotFound.tsx
replaceInFile('src/components/not-found/NotFound.tsx', [
  ['<p>对不起,没有找到您所需要的页面,可能是URL不确定,或者页面已被移除。</p>', '<p>Sorry, the page you are looking for could not be found or has been removed.</p>'],
]);

// 20. layout/user-layout/sidebar/Sidebar.tsx
replaceInFile('src/layout/user-layout/sidebar/Sidebar.tsx', [
  ["name: '我的积分',", "name: 'Credits',"],
]);

// 21. layout/agreement-layout/sidebar/Sidebar.tsx
replaceInFile('src/layout/agreement-layout/sidebar/Sidebar.tsx', [
  ['name: "用户协议",', 'name: "User Agreement",'],
  ['name: "隐私政策",', 'name: "Privacy Policy",'],
  ['name: "会员服务协议",', 'name: "VIP Agreement",'],
]);

// 22. layout/user-layout/sidebar/cropUpload/CropUpload.tsx
replaceInFile('src/layout/user-layout/sidebar/cropUpload/CropUpload.tsx', [
  ["Toast.error('只能上传png/jpeg/jpg格式');", "Toast.error('Only PNG, JPEG, or JPG formats are supported');"],
  ["Toast.error('上传图片大小不能超过 2MB!');", "Toast.error('Avatar image cannot exceed 2MB');"],
  ["Toast.success('上传成功');", "Toast.success('Uploaded successfully');"],
  ["Toast.error('上传失败');", "Toast.error('Upload failed');"],
]);

// 23. components/content/video-split/VideoSplit.tsx
replaceInFile('src/components/content/video-split/VideoSplit.tsx', [
  ['分割时间点：', 'Split points: '],
  [".join('、')", ".join(', ')"],
]);

// 24. components/content/Content.tsx
replaceInFile('src/components/content/Content.tsx', [
  ["? '这是一组1秒/帧的视频帧图，请一句话描述一下视频内容：视频展示了...'", "? 'This is a set of video frames at 1 frame/sec. Please summarize the video in one sentence: The video shows...'"],
  [": '这是一张图片，请一句话描述一下图片内容',", ": 'This is an image. Please describe the image content in one sentence.',"],
  ["throw new Error('类型不支持', type);", "throw new Error('Unsupported type: ' + type);"],
]);

// 25. options/components/blendMode/BlendMode.tsx
replaceInFile('src/pages/editor/components/options/components/blendMode/BlendMode.tsx', [
  ["{ val: PIXI.BLEND_MODES.NORMAL, ename: 'NORMAL', name: '正常' },", "{ val: PIXI.BLEND_MODES.NORMAL, ename: 'Normal', name: 'Normal' },"],
  ["{ val: PIXI.BLEND_MODES.ADD, ename: 'ADD', name: '线性减淡' },", "{ val: PIXI.BLEND_MODES.ADD, ename: 'Add', name: 'Add' },"],
  ["{ val: PIXI.BLEND_MODES.MULTIPLY, ename: 'MULTIPLY', name: '正片叠底' },", "{ val: PIXI.BLEND_MODES.MULTIPLY, ename: 'Multiply', name: 'Multiply' },"],
  ["{ val: PIXI.BLEND_MODES.SCREEN, ename: 'SCREEN', name: '滤色' },", "{ val: PIXI.BLEND_MODES.SCREEN, ename: 'Screen', name: 'Screen' },"],
  ["{ val: PIXI.BLEND_MODES.NONE, ename: 'NONE', name: '移除背景' },", "{ val: PIXI.BLEND_MODES.NONE, ename: 'Remove Background', name: 'Remove Background' },"],
  ["{ val: PIXI.BLEND_MODES.DST_IN, ename: 'DST_IN', name: '反向蒙版' },", "{ val: PIXI.BLEND_MODES.DST_IN, ename: 'Inverted Mask', name: 'Inverted Mask' },"],
  ["{ val: PIXI.BLEND_MODES.DST_OUT, ename: 'DST_OUT', name: '正向蒙版' },", "{ val: PIXI.BLEND_MODES.DST_OUT, ename: 'Mask', name: 'Mask' },"],
  ["{ val: PIXI.BLEND_MODES.SUBTRACT, ename: 'SUBTRACT', name: '底片' },", "{ val: PIXI.BLEND_MODES.SUBTRACT, ename: 'Subtract', name: 'Subtract' },"],
]);

// 26. options/components/element-data/CustomShakeModal.tsx
replaceInFile('src/pages/editor/components/options/components/element-data/CustomShakeModal.tsx', [
  ['okText="生成并应用"', 'okText="Generate & Apply"'],
  ["{isRandom ? '随机偏移' : '正弦往复'}", "{isRandom ? 'Random Offset' : 'Sine Wave'}"],
  ['点击"预览"查看动画效果', 'Click "Preview" to inspect animation'],
  ['>预览<', '>Preview<'],
]);

// 27. options/components/element-data/FrameData.tsx
replaceInFile('src/pages/editor/components/options/components/element-data/FrameData.tsx', [
  ['>抖↘<', '>Shake ↘<'],
  ['>抖↓<', '>Shake ↓<'],
  ['>抖↙<', '>Shake ↙<'],
  ['>抖↔<', '>Shake ↔<'],
  ['>清空<', '>Clear<'],
]);

// 28. options/components/color/Color.tsx & gradual-color/GradualColor.tsx
replaceInFile('src/pages/editor/components/options/components/color/Color.tsx', [
  ['content="吸取颜色"', 'content="Pick Color"'],
]);

replaceInFile('src/pages/editor/components/options/components/gradual-color/GradualColor.tsx', [
  ['content="删除颜色"', 'content="Delete Color"'],
]);

// 29. Undo/redo history descriptions in options components
replaceInFile('src/pages/editor/components/options/components/align/Align.tsx', [
  ["desc: '修改镜像偏移量X',", "desc: 'Change Mirror Offset X',"],
  ["desc: '修改镜像偏移量Y',", "desc: 'Change Mirror Offset Y',"],
]);

replaceInFile('src/pages/editor/components/options/components/align/Flip.tsx', [
  ["desc: '镜像翻转',", "desc: 'Flip',"],
]);

replaceInFile('src/pages/editor/components/options/components/audio/Audio.tsx', [
  ["desc: '设置音量',", "desc: 'Set Volume',"],
  ["desc: '淡入声音',", "desc: 'Fade In Audio',"],
  ["desc: '淡出声音',", "desc: 'Fade Out Audio',"],
]);

replaceInFile('src/pages/editor/components/options/components/green-screen/GreenScreen.tsx', [
  ["desc: '修改绿幕抠像颜色',", "desc: 'Change Chroma Key Color',"],
  ["desc: '修改绿幕参数',", "desc: 'Change Chroma Key Param',"],
]);

replaceInFile('src/pages/editor/components/options/components/lottie/Lottie.tsx', [
  ["desc: '修改播放速度',", "desc: 'Change Playback Speed',"],
]);

replaceInFile('src/pages/editor/components/options/components/mask/Mask.tsx', [
  ["desc: '修改W',", "desc: 'Resize Width',"],
  ["desc: '修改H',", "desc: 'Resize Height',"],
]);

replaceInFile('src/pages/editor/components/options/components/opacity/Opacity.tsx', [
  ["desc: '设置透明度',", "desc: 'Set Opacity',"],
]);

replaceInFile('src/pages/editor/components/options/components/rotation/Rotation.tsx', [
  ["desc: '修改旋转角度',", "desc: 'Change Rotation',"],
]);

replaceInFile('src/pages/editor/components/options/components/size/Size.tsx', [
  ["desc: '修改W',", "desc: 'Resize Width',"],
  ["desc: '修改H',", "desc: 'Resize Height',"],
]);

replaceInFile('src/pages/editor/components/options/components/size-wh/SizeWh.tsx', [
  ["desc: '修改W',", "desc: 'Resize Width',"],
  ["desc: '修改H',", "desc: 'Resize Height',"],
]);

replaceInFile('src/pages/editor/components/options/components/speed/CurveSpeed.tsx', [
  ["desc: '修改曲线变速',", "desc: 'Change Speed Curve',"],
]);

replaceInFile('src/pages/editor/components/options/components/speed/Speed.tsx', [
  ["desc: '修改播放速度',", "desc: 'Change Playback Speed',"],
]);

replaceInFile('src/pages/editor/components/options/components/strength/Strength.tsx', [
  ["desc: '修改滤镜强度',", "desc: 'Change Filter Strength',"],
]);

replaceInFile('src/pages/editor/components/options/components/text-content/TextContent.tsx', [
  ["desc: '修改文本内容',", "desc: 'Edit Text Content',"],
]);

replaceInFile('src/pages/editor/components/options/components/transition/Transition.tsx', [
  ["desc: '修改转场时长',", "desc: 'Change Transition Duration',"],
]);

// 30. TextStyle.tsx history desc
replaceInFile('src/pages/editor/components/options/components/text-style/TextStyle.tsx', [
  ["desc: '文本对齐' + key,", "desc: 'Align Text ' + key,"],
  ["desc: '修改字体',", "desc: 'Change Font',"],
  ["desc: '加粗&取消',", "desc: 'Toggle Bold',"],
  ["desc: '倾斜',", "desc: 'Toggle Italic',"],
  ["desc: '修改文字行高',", "desc: 'Change Line Height',"],
  ["desc: '修改文字间距',", "desc: 'Change Letter Spacing',"],
  ["desc: '文字颜色类型',", "desc: 'Change Text Color Type',"],
  ["desc: '文字颜色',", "desc: 'Change Text Color',"],
  ["desc: '修改文字渐变角度',", "desc: 'Change Gradient Angle',"],
  ["desc: '修改文字渐变色',", "desc: 'Change Gradient Color',"],
  ["desc: '修改文字描边颜色',", "desc: 'Change Stroke Color',"],
  ["desc: '修改文字阴影',", "desc: 'Change Text Shadow',"],
  ["desc: '文字阴影距离',", "desc: 'Change Shadow Distance',"],
  ["desc: '文字阴影角度',", "desc: 'Change Shadow Angle',"],
  ["desc: '修改文字描边',", "desc: 'Change Stroke Width',"],
  ["desc: '修改文字背景颜色',", "desc: 'Change Background Color',"],
  ["desc: '修改文字圆角',", "desc: 'Change Border Radius',"],
  ["desc: '修改文字padding',", "desc: 'Change Text Padding',"],
]);

// 31. addItem.ts & DragItem.tsx & timeline desc
replaceInFile('src/pages/editor/components/sources/addItem.ts', [
  ["desc: '添加元素' + elementData.id,", "desc: 'Add element ' + elementData.id,"],
]);

replaceInFile('src/pages/editor/common/dragitem/DragItem.tsx', [
  ["desc: '替换元素资源' + elementData.id,", "desc: 'Replace element resource ' + elementData.id,"],
]);

replaceInFile('src/pages/editor/components/timeline2/tracks/ElementButton.tsx', [
  ["desc: '更新元素clipTime，duration',", "desc: 'Update clip time and duration',"],
]);

replaceInFile('src/pages/editor/components/timeline2/tracks/useDragItem.tsx', [
  ["desc: '更新元素startTime',", "desc: 'Update element start time',"],
]);

replaceInFile('src/pages/editor/components/sources/caption/captions/Captions.tsx', [
  ["desc: '自动计算字幕时长',", "desc: 'Auto calculate caption duration',"],
  ["desc: '添加字幕',", "desc: 'Add caption',"],
  ["desc: `批量添加字幕 × ${lines.length}`,", "desc: `Batch add captions × ${lines.length}`,"],
  ['placeholder="每行代表一段字幕"', 'placeholder="Enter one caption per line"'],
]);

// 32. More.tsx & qrcode
replaceInFile('src/pages/editor/components/sources/more/More.tsx', [
  ["name: '二维码',", "name: 'QR Code',"],
]);

replaceInFile('src/pages/editor/plugins/qrcode/config.tsx', [
  ["name: '二维码',", "name: 'QR Code',"],
]);

replaceInFile('src/pages/editor/plugins/qrcode/QrcodeSet.tsx', [
  ["desc: '修改二维码内容',", "desc: 'Change QR Code Content',"],
  ["desc: '修改二维码颜色',", "desc: 'Change QR Code Color',"],
]);

// 33. my/lottie/Lottie.tsx & uploadDecode.ts
replaceInFile('src/pages/editor/components/sources/my/lottie/Lottie.tsx', [
  ['大小：', 'Size: '],
  ['<Button onClick={screenshot}>截图</Button>', '<Button onClick={screenshot}>Screenshot</Button>'],
]);

replaceInFile('src/pages/editor/components/sources/my/uploadDecode.ts', [
  ["onLog?.('正在分析视频信息...');", "onLog?.('Analyzing video information...');"],
  ["onLog?.('视频无需转码，直接使用原文件');", "onLog?.('Video does not need transcoding, using original file.');"],
  ["onLog?.('开始转码...');", "onLog?.('Starting transcoding...');"],
  ["onLog?.('转码完成');", "onLog?.('Transcoding completed.');"],
  ["onLog?.('开始强制转码...');", "onLog?.('Starting force transcoding...');"],
  ["onLog?.('强制转码完成');", "onLog?.('Force transcoding completed.');"],
]);

// 34. CreditRecharge.tsx & VipRecharge.tsx
replaceInFile('src/pages/editor/components/header/CreditRecharge.tsx', [
  ["0: '待支付',", "0: 'Pending Payment',"],
  ["1: '已支付，正在发放',", "1: 'Processing...',"],
  ["2: '充值成功',", "2: 'Successful',"],
  ["3: '已关闭',", "3: 'Closed',"],
  ["4: '发放失败，请联系管理员',", "4: 'Failed',"],
  ["Toast.success('充值成功');", "Toast.success('Recharge successful');"],
  ['<h1>积分充值</h1>', '<h1>Recharge Credits</h1>'],
  ['当前积分：', 'Current Credits: '],
  ['积分可用于视频生成、智能工具、素材处理等场景', 'Credits can be used for rendering and smart tools.'],
  [' 积分</span>', ' Credits</span>'],
  ['过期倒计时：', 'Expires in: '],
  ['二维码已过期', 'QR code expired'],
  ['应付金额：', 'Total: '],
  ['使用微信、支付宝扫码支付', 'Scan QR code to pay'],
  ['等待支付', 'Waiting for payment'],
  ['刷新状态', 'Refresh Status'],
]);

replaceInFile('src/pages/editor/components/header/VipRecharge.tsx', [
  ["0: '待支付',", "0: 'Pending Payment',"],
  ["1: '已支付，正在开通',", "1: 'Activating...',"],
  ["2: '会员开通成功',", "2: 'VIP Activated',"],
  ["3: '已关闭',", "3: 'Closed',"],
  ["4: '发放失败，请联系管理员',", "4: 'Failed',"],
  ["day: '天',", "day: ' days',"],
  ["month: '个月',", "month: ' months',"],
  ["year: '年',", "year: ' years',"],
  ["Toast.success('会员开通成功');", "Toast.success('VIP activated successfully');"],
  ['<h1>开通会员</h1>', '<h1>Subscribe VIP</h1>'],
  ['会员权益自动叠加，未过期将自动顺延', 'VIP benefits accumulate and renew automatically.'],
  ['原价', 'Regular'],
  ['赠送 ', 'Bonus '],
  [' 积分', ' Credits'],
  ['有效期 ', 'Valid for '],
  ['过期倒计时：', 'Expires in: '],
  ['二维码已过期', 'QR code expired'],
  ['应付金额：', 'Total: '],
  ['使用微信、支付宝扫码支付', 'Scan QR code to pay'],
  ['等待支付', 'Waiting for payment'],
  ['刷新状态', 'Refresh Status'],
]);

// 35. uploadBeforeData.ts
replaceInFile('src/pages/editor/tools/uploadBeforeData.ts', [
  ["throw new Error('文件类型未知，请传入type参数');", "throw new Error('Unknown file type, please pass type parameter');"],
  ["throw new Error('未知文件类型' + url);", "throw new Error('Unknown file type: ' + url);"],
]);

console.log('[localize] All application files successfully localized.');
