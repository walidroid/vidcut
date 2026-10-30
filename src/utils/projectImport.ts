import JSZip from 'jszip';
import pLimit from 'p-limit';
import type { MovieData } from 'video-core-sdk';
import { checkNdata } from './util';
import { localDB, type MaterialRecord } from '@database/localDB';
import { getRootHandle, saveFileToLocal } from '@services/localStorageService';

/** 已知素材分类文件夹名，用于识别 zip 内素材路径结构 */
const KNOWN_MATERIAL_TYPES = new Set([
  'video',
  'image',
  'audio',
  'text',
  'lottie',
  'font',
  'sticker',
  'effect',
  'filter',
  'transition',
  'other',
  'apng',
  'face',
  'role',
  'scene',
  'special',
  'goods',
  'poster', // 工程封面
]);

export interface ImportProjectZipResult {
  /** 素材地址已改写为本地路径的工程数据 */
  data: MovieData;
  /** 成功写入本地存储的素材文件数 */
  fileCount: number;
  /** 写入失败或 zip 中缺失的素材路径 */
  skipped: string[];
}

export interface ImportProjectZipOptions {
  onProgress?: (done: number, total: number) => void;
}

/** zip 内条目路径归一化（部分压缩工具使用反斜杠） */
function normalizeZipPath(path: string): string {
  return path.replace(/\\/g, '/').replace(/^\.\//, '');
}

/**
 * 归一化 materials/ 之后的路径片段：
 * 去掉导出时携带的旧 appId 段，统一为 {type}/... 结构，
 * 拼上当前 appId 后可隔离不同工程导入的素材，避免同名互相覆盖
 */
function normalizeMaterialRest(rest: string): string {
  const segs = rest.split('/').filter(Boolean);
  if (segs.length === 0) {
    return 'other/file';
  }
  if (KNOWN_MATERIAL_TYPES.has(segs[0].toLowerCase())) {
    return segs.join('/');
  }
  if (segs.length >= 2 && KNOWN_MATERIAL_TYPES.has(segs[1].toLowerCase())) {
    return segs.slice(1).join('/');
  }
  return ['other', ...segs].join('/');
}

/** 在 zip 中定位 project.json，兼容直接压缩和套一层文件夹两种打包方式 */
function findProjectEntry(zip: JSZip): { basePath: string; entry: any } | null {
  let best: { basePath: string; entry: any; depth: number } | null = null;
  for (const [rawName, entry] of Object.entries(zip.files)) {
    if ((entry as any).dir) {
      continue;
    }
    const name = normalizeZipPath(rawName);
    const segs = name.split('/').filter(Boolean);
    if (segs[segs.length - 1] !== 'project.json') {
      continue;
    }
    if (!best || segs.length < best.depth) {
      best = { basePath: segs.slice(0, -1).join('/'), entry: entry as any, depth: segs.length };
    }
  }
  return best ? { basePath: best.basePath, entry: best.entry } : null;
}

/** 为导入的本地素材建立/更新索引记录，使素材面板可见且可被清理 */
async function saveMaterialRecords(ndata: MovieData, appId: string, sizeMap: Map<string, number>): Promise<void> {
  const now = Date.now();
  const existing = await localDB.materials.where('appId').equals(appId).toArray();
  const byPath = new Map(existing.map(r => [r.relativePath, r]));
  const seen = new Set<string>();

  const pick = (v: any): string | undefined =>
    typeof v === 'string' && v.startsWith('materials/') ? v : undefined;

  for (const res of (ndata.resouces || []) as Array<Record<string, any>>) {
    const url = pick(res.url);
    if (!url || seen.has(url)) {
      continue; // 非本地素材不建记录
    }
    seen.add(url);
    const old = byPath.get(url);
    const thumb = pick(res.thumb);
    const frames = pick(res.frames);
    const wave = pick(res.wave);
    const record: MaterialRecord = {
      id: old?.id ?? `imp_${now}_${Math.random().toString(36).slice(2, 8)}`,
      appId,
      name: res.name || url.split('/').pop() || 'material',
      type: (res.type as string) || 'other',
      fileName: url.split('/').pop(),
      relativePath: url,
      thumbRelativePath: thumb,
      thumbFileName: thumb?.split('/').pop(),
      framesRelativePath: frames,
      framesFileName: frames?.split('/').pop(),
      waveRelativePath: wave,
      waveFileName: wave?.split('/').pop(),
      size: sizeMap.get(url) ?? old?.size ?? 0,
      attrs: { ...(res.attrs || {}) },
      from: res.from === 'system' ? 'system' : 'user',
      tag: old?.tag,
      createdAt: old?.createdAt ?? now,
      updatedAt: now,
    };
    await localDB.materials.put(record);
  }
}

/**
 * 导入工程包（zip：project.json + materials/ 素材）
 *
 * 1. 解压并定位 project.json（根目录或套一层文件夹均可），校验数据合法性；
 * 2. 将包内 materials/ 下全部素材文件写入本地存储目录，
 *    统一归一到 materials/{appId}/{type}/ 路径下；
 * 3. 改写工程数据中的素材地址为本地路径（远端/data: 地址保持不变）；
 * 4. 为本地素材建立 IndexedDB 索引记录（同路径覆盖更新，重复导入不产生重复记录）。
 */
export async function importProjectZip(
  file: File,
  appId: string,
  options: ImportProjectZipOptions = {},
): Promise<ImportProjectZipResult> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch (err) {
    console.error('zip 解析失败:', err);
    throw new Error('header_project_zip_invalid');
  }

  const project = findProjectEntry(zip);
  if (!project) {
    throw new Error('header_project_json_missing');
  }

  const ndata = JSON.parse(await project.entry.async('string')) as MovieData;
  if (!checkNdata(ndata)) {
    throw new Error('header_project_toast');
  }

  // 素材要写入本地存储目录，根句柄必须就绪
  const root = await getRootHandle();
  if (!root) {
    throw new Error('header_project_import_no_root');
  }

  // 收集素材文件：包内 materials/ 路径 -> 本地目标路径
  const materialsPrefix = project.basePath ? `${project.basePath}/materials/` : 'materials/';
  const pathMap = new Map<string, string>();
  const writeTasks: Array<{ entry: any; innerPath: string; targetPath: string }> = [];

  for (const [rawName, entry] of Object.entries(zip.files)) {
    if ((entry as any).dir) {
      continue;
    }
    const name = normalizeZipPath(rawName);
    if (!name.startsWith(materialsPrefix)) {
      continue;
    }
    const rest = name.slice(materialsPrefix.length);
    // 过滤 mac 压缩产生的资源叉文件和隐藏文件
    if (rest.split('/').some(seg => seg.startsWith('.'))) {
      continue;
    }
    const innerPath = `materials/${rest}`;
    if (pathMap.has(innerPath)) {
      continue;
    }
    const targetPath = `materials/${appId}/${normalizeMaterialRest(rest)}`;
    pathMap.set(innerPath, targetPath);
    writeTasks.push({ entry: entry as any, innerPath, targetPath });
  }

  const skipped: string[] = [];
  const sizeMap = new Map<string, number>();
  let done = 0;
  const total = writeTasks.length;
  options.onProgress?.(done, total);

  const limit = pLimit(4);
  await Promise.all(
    writeTasks.map(task =>
      limit(async () => {
        try {
          const blob = await task.entry.async('blob');
          const saved = await saveFileToLocal(blob, task.targetPath, root);
          if (saved) {
            sizeMap.set(task.targetPath, blob.size);
          } else {
            skipped.push(task.innerPath);
          }
        } catch (err) {
          console.warn('写入素材文件失败:', task.innerPath, err);
          skipped.push(task.innerPath);
        }
        done++;
        options.onProgress?.(done, total);
      }),
    ),
  );

  // 全部写入失败时中止导入，避免得到一个素材全部丢失的工程
  if (total > 0 && sizeMap.size === 0) {
    throw new Error('header_project_import_write_failed');
  }

  // 改写工程数据中的素材地址，并记录缺失的引用
  for (const res of (ndata.resouces || []) as Array<Record<string, any>>) {
    for (const key of ['url', 'thumb', 'wave', 'frames'] as const) {
      const value = res[key];
      if (typeof value === 'string' && value.startsWith('materials/')) {
        const target = pathMap.get(value);
        if (target) {
          res[key] = target;
        } else if (!skipped.includes(value)) {
          skipped.push(value);
        }
      }
    }
    if (res.attrs && typeof res.attrs === 'object') {
      for (const key of ['frames', 'wave'] as const) {
        const value = res.attrs[key];
        if (typeof value === 'string' && value.startsWith('materials/')) {
          const target = pathMap.get(value);
          if (target) {
            res.attrs[key] = target;
          }
        }
      }
    }
  }

  // 工程封面路径同样需要映射
  const posterValue = (ndata as any).poster;
  if (typeof posterValue === 'string' && posterValue.startsWith('materials/')) {
    const target = pathMap.get(posterValue);
    if (target) {
      (ndata as any).poster = target;
    } else if (!skipped.includes(posterValue)) {
      skipped.push(posterValue);
    }
  }

  await saveMaterialRecords(ndata, appId, sizeMap);

  return { data: ndata, fileCount: sizeMap.size, skipped };
}
