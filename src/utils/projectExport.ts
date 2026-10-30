import JSZip from 'jszip';
import pLimit from 'p-limit';
import type { MovieData } from 'video-core-sdk';
import { utils } from 'video-core-sdk';
import { config } from '@config/index';
import { getMaterialFile } from '@services/localStorageService';

/** 素材上需要打包的文件字段，suffix 用于同素材相关文件命名；attrs.* 为异步补生成的帧图/音波路径 */
const RESOURCE_FILE_FIELDS: Array<{ key: string; suffix: string }> = [
  { key: 'url', suffix: '' },
  { key: 'thumb', suffix: '_thumb' },
  { key: 'wave', suffix: '_wave' },
  { key: 'frames', suffix: '_frames' },
  { key: 'attrs.frames', suffix: '_frames' },
  { key: 'attrs.wave', suffix: '_wave' },
];

/** 读取（可能嵌套在 attrs 里的）字段值 */
function getFieldValue(obj: Record<string, any>, key: string): any {
  if (!key.includes('.')) {
    return obj[key];
  }
  const [outer, inner] = key.split('.');
  return obj[outer]?.[inner];
}

/** 根据扩展名推断素材分类文件夹 */
const EXT_FOLDER_MAP: Record<string, string> = {
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  mkv: 'video',
  mp3: 'audio',
  wav: 'audio',
  aac: 'audio',
  m4a: 'audio',
  flac: 'audio',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  svg: 'image',
  bmp: 'image',
  apng: 'image',
  json: 'lottie',
  ttf: 'font',
  otf: 'font',
  woff: 'font',
  woff2: 'font',
};

export interface ExportProjectZipResult {
  /** 打包的素材文件总数 */
  total: number;
  /** 成功打包的文件数 */
  success: number;
  /** 获取失败的素材（保留原始地址，不影响导出） */
  failed: Array<{ name: string; url: string }>;
}

export interface ExportProjectZipOptions {
  onProgress?: (done: number, total: number) => void;
}

/** 替换文件名中的非法字符 */
function sanitizeFileName(name: string): string {
  return (name || 'file').replace(/[\\/:*?"<>|]/g, '_').trim() || 'file';
}

/** 从路径型 URL 中提取文件名（去掉查询参数），非路径型返回空 */
function getPathFileName(url: string): string {
  const clean = url.split(/[?#]/)[0];
  const last = clean.split('/').filter(Boolean).pop() || '';
  // data:/blob: 这类地址提取出来的不是合法文件名，交由调用方用资源名兜底
  if (!last || !/\.[a-zA-Z0-9]{1,6}$/.test(last)) {
    return '';
  }
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

function getFileExt(name: string): string {
  const mat = name.match(/\.([a-zA-Z0-9]{1,6})$/);
  return mat ? mat[1].toLowerCase() : '';
}

/** 素材在 zip 内的分类文件夹：优先使用素材类型，其次按扩展名推断 */
function getResourceFolder(res: { type?: string; url?: string }): string {
  const type = (res.type || '').split('/').filter(Boolean).pop() || '';
  if (type) return sanitizeFileName(type);
  const ext = getFileExt(getPathFileName(res.url || ''));
  return EXT_FOLDER_MAP[ext] || 'other';
}

/** data:/blob: 地址的媒体类型 */
function mimeFromDataUrl(url: string): string {
  const mat = url.match(/^data:([^;,]+)[;,]/);
  return mat ? mat[1] : '';
}

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'application/json': 'json',
    'text/text': 'json', // 音波数据（btoa(JSON.stringify(peacks))）的 mime
    'text/plain': 'txt',
  };
  const key = mime.split(';')[0].trim();
  return map[key] || 'bin';
}

/** 获取素材文件内容：本地路径读文件系统，其余地址走 fetch */
async function loadResourceBlob(url: string): Promise<Blob | null> {
  try {
    if (url.startsWith('materials/')) {
      return await getMaterialFile(url);
    }
    if (/^(data:|blob:)/i.test(url)) {
      const resp = await fetch(url);
      return await resp.blob();
    }
    // 相对路径的资源地址需要拼接资源 host
    const target = /^https?:\/\//i.test(url) ? url : utils.reURL(url, config.resourcesHost);
    const resp = await fetch(target);
    if (!resp.ok) {
      return null;
    }
    return await resp.blob();
  } catch (err) {
    console.warn('获取素材失败:', url, err);
    return null;
  }
}

/** 触发浏览器下载 Blob 文件 */
function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 导出工程文件（JSON + 全部素材）为一个 zip 包
 *
 * zip 结构：
 * ├── project.json                     工程数据（素材地址已改写为包内相对路径）
 * └── materials/{素材类型}/{文件名}     按素材路径/类型分文件夹存放
 *
 * 本地素材（materials/ 开头的路径）在包内保持原路径，工程数据无需改写；
 * 远端/data:/blob: 素材下载后放入对应类型文件夹，并将工程数据中的地址改写为包内路径；
 * 获取失败的素材保留原始地址，不影响工程数据可用性。
 */
export async function exportProjectZip(
  ndata: MovieData,
  fileName: string,
  options: ExportProjectZipOptions = {},
): Promise<ExportProjectZipResult> {
  // 深拷贝，改写素材地址不能影响编辑器内的数据
  const data = JSON.parse(JSON.stringify(ndata)) as MovieData;
  const zip = new JSZip();
  const failed: ExportProjectZipResult['failed'] = [];

  // 同一地址只打包一次，多个字段引用时复用同一个包内路径
  interface PackTask {
    url: string;
    zipPath: string;
    name: string;
    // 获取成功后需要改写为包内路径的字段（zipPath 与原地址相同时为空）
    rewrites: Array<{ target: Record<string, any>; key: string }>;
  }
  const urlTaskMap = new Map<string, PackTask>();
  const tasks: PackTask[] = [];
  const usedZipPaths = new Set<string>();
  let done = 0;

  const uniqueZipPath = (path: string): string => {
    if (!usedZipPaths.has(path)) {
      usedZipPaths.add(path);
      return path;
    }
    const dot = path.lastIndexOf('.');
    const stem = dot > path.lastIndexOf('/') ? path.slice(0, dot) : path;
    const ext = dot > path.lastIndexOf('/') ? path.slice(dot) : '';
    let i = 2;
    let next = `${stem}_${i}${ext}`;
    while (usedZipPaths.has(next)) {
      i++;
      next = `${stem}_${i}${ext}`;
    }
    usedZipPaths.add(next);
    return next;
  };

  for (const res of (data.resouces || []) as Array<Record<string, any>>) {
    const folder = getResourceFolder(res);
    const resName = res.name || res.id || 'file';
    // 用不带扩展名的素材名给封面/帧图等相关文件命名
    const resStem = sanitizeFileName(resName).replace(/\.[^.]+$/, '') || 'file';

    for (const { key, suffix } of RESOURCE_FILE_FIELDS) {
      const value = getFieldValue(res, key);
      if (!value || typeof value !== 'string') {
        continue;
      }
      // 改写目标：attrs.* 字段写在 res.attrs 上
      const [ns, innerKey] = key.split('.');
      const rewriteTarget = innerKey ? res.attrs : res;
      const rewriteKey = innerKey || key;

      const exist = urlTaskMap.get(value);
      if (exist) {
        // 地址已被收集，复用包内路径和获取结果
        if (exist.zipPath !== value) {
          exist.rewrites.push({ target: rewriteTarget, key: rewriteKey });
        }
        continue;
      }

      let zipPath: string;
      if (value.startsWith('materials/')) {
        // 本地素材：包内保持原路径，工程数据不用改
        zipPath = uniqueZipPath(value);
      } else {
        // 远端/内联素材：按类型放入 materials/{type}/，并改写工程数据
        let name = getPathFileName(value);
        if (!name) {
          const mime = mimeFromDataUrl(value);
          const ext = mime ? extFromMime(mime) : 'bin';
          name = `${resStem}${suffix}.${ext}`;
        } else if (suffix) {
          const dot = name.lastIndexOf('.');
          name = `${name.slice(0, dot)}${suffix}${name.slice(dot)}`;
        }
        zipPath = uniqueZipPath(`materials/${folder}/${sanitizeFileName(name)}`);
      }

      const task: PackTask = {
        url: value,
        zipPath,
        name: resName,
        rewrites: zipPath !== value ? [{ target: rewriteTarget, key: rewriteKey }] : [],
      };
      urlTaskMap.set(value, task);
      tasks.push(task);
    }
  }

  // 工程封面（本地模式下是 materials/ 路径或 data:URL，同样需要进包）
  const posterValue = (data as any).poster;
  if (typeof posterValue === 'string' && posterValue && !posterValue.startsWith('blob:')) {
    const posterExist = urlTaskMap.get(posterValue);
    if (posterExist) {
      if (posterExist.zipPath !== posterValue) {
        posterExist.rewrites.push({ target: data as any, key: 'poster' });
      }
    } else {
      let posterZipPath: string;
      if (posterValue.startsWith('materials/')) {
        posterZipPath = uniqueZipPath(posterValue);
      } else {
        const mime = mimeFromDataUrl(posterValue);
        let ext = mime ? extFromMime(mime) : '';
        if (!ext) {
          ext = getPathFileName(posterValue).split('.').pop() || 'png';
        }
        posterZipPath = uniqueZipPath(`materials/poster/poster.${ext}`);
      }
      const posterTask: PackTask = {
        url: posterValue,
        zipPath: posterZipPath,
        name: 'poster',
        rewrites: posterZipPath !== posterValue ? [{ target: data as any, key: 'poster' }] : [],
      };
      urlTaskMap.set(posterValue, posterTask);
      tasks.push(posterTask);
    }
  }

  const total = tasks.length;
  options.onProgress?.(done, total);

  const limit = pLimit(4);
  await Promise.all(
    tasks.map(task =>
      limit(async () => {
        const blob = await loadResourceBlob(task.url);
        if (blob) {
          // 媒体文件已是压缩格式，STORE 避免 CPU 浪费
          zip.file(task.zipPath, blob, { compression: 'STORE' });
          for (const { target, key } of task.rewrites) {
            target[key] = task.zipPath;
          }
        } else {
          failed.push({ name: task.name, url: task.url });
        }
        done++;
        options.onProgress?.(done, total);
      }),
    ),
  );

  zip.file('project.json', JSON.stringify(data, null, 2), { compression: 'DEFLATE' });
  const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
  downloadBlob(blob, `${fileName}.zip`);

  return { total, success: total - failed.length, failed };
}
