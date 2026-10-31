const fs = require('fs');

// 1. curveSpeedMock.ts
let csm = fs.readFileSync('src/pages/editor/components/options/components/speed/curveSpeedMock.ts', 'utf8');
csm = csm.replace("name: '自定义'", "name: 'Custom'")
         .replace("name: '蒙太奇'", "name: 'Montage'");
fs.writeFileSync('src/pages/editor/components/options/components/speed/curveSpeedMock.ts', csm, 'utf8');

// 2. BasicService.ts
let bs = fs.readFileSync('src/server/BasicService.ts', 'utf8');
bs = bs.replace("return [null, '登录失效'];", "return [null, 'Session expired'];")
       .replace("return Promise.reject('请求已取消');", "return Promise.reject('Request cancelled');");
fs.writeFileSync('src/server/BasicService.ts', bs, 'utf8');

// 3. util.ts
let ut = fs.readFileSync('src/utils/util.ts', 'utf8');
ut = ut.replace("reject(new Error('无法获取Canvas上下文'));", "reject(new Error('Failed to get Canvas context'));")
       .replace("reject(new Error('图片加载失败'));", "reject(new Error('Failed to load image'));")
       .replace("reject(new Error('没有提供文件'));", "reject(new Error('No file provided'));")
       .replace("reject(new Error('文件不是JSON类型'));", "reject(new Error('File is not JSON type'));")
       .replace("reject(new Error('JSON解析失败: ' + error.message));", "reject(new Error('JSON parse failed: ' + error.message));")
       .replace("reject(new Error('文件读取失败: ' + reader.error.message));", "reject(new Error('File read failed: ' + reader.error.message));")
       .replace("alert('保存文件失败，请重试');", "alert('Failed to save file, please try again.');")
       .replace("throw new Error(`无法获取视频: ${response.statusText}`);", "throw new Error(`Failed to load video: ${response.statusText}`);")
       .replace("throw new Error(`HTTP错误! 状态: ${response.status}`);", "throw new Error(`HTTP error! Status: ${response.status}`);");
fs.writeFileSync('src/utils/util.ts', ut, 'utf8');

console.log('[service-cleanup] Done.');

