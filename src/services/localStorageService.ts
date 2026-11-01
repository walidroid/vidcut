import { localDB, type MaterialRecord, type ProjectRecord } from '@database/localDB';
import { showDirectoryPicker } from 'use-fs-access';
import { Toast } from '@douyinfe/semi-ui';
import type { MovieData } from 'video-core-sdk';

const ROOT_HANDLE_KEY = 'root';

/** In-memory cache for root directory handle to avoid repetitive IndexedDB queries */
let cachedRootHandle: FileSystemDirectoryHandle | null = null;

/** 检查 File System Access API 是否可用 */
export function isFSApiSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'showDirectoryPicker' in window || (typeof navigator !== 'undefined' && !!navigator.storage?.getDirectory);
}
export function _unused_old_isFSApiSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'showDirectoryPicker' in window || (typeof navigator !== 'undefined' && !!navigator.storage?.getDirectory);
}
/** 获取持久化的文件夹句柄 (优先已选文件夹，默认使用沙箱 OPFS 自动持久化存储) */
async function getStoredHandle(): Promise<FileSystemDirectoryHandle | null> {
  if (cachedRootHandle) {
    return cachedRootHandle;
  }
  try {
    const record = await localDB.folderHandles.get(ROOT_HANDLE_KEY);
    if (record?.handle) {
      const opts: FileSystemHandlePermissionDescriptor = { mode: 'readwrite' };
      try {
        const permission = await record.handle.queryPermission(opts);
        if (permission === 'granted') {
          cachedRootHandle = record.handle;
          return record.handle;
        }
        const newPermission = await record.handle.requestPermission(opts);
        if (newPermission === 'granted') {
          cachedRootHandle = record.handle;
          return record.handle;
        }
      } catch (err) {
        console.warn('文件系统权限请求警告:', err);
      }
    }
  } catch (err) {
    console.warn('读取本地句柄警告:', err);
  }

  // 默认使用 Origin Private File System (OPFS)，Chromium 和 Electron 原生支持，免授权弹窗且永久持久化
  if (typeof navigator !== 'undefined' && navigator.storage && typeof navigator.storage.getDirectory === 'function') {
    try {
      const opfsRoot = await navigator.storage.getDirectory();
      const opfsHandle = await opfsRoot.getDirectoryHandle('vidcut_workspace', { create: true });
      cachedRootHandle = opfsHandle;
      return opfsHandle;
    } catch (err) {
      console.warn('OPFS 初始化失败:', err);
    }
  }

  return null;
}

/** 初始化本地存储文件夹（首次使用或用户更换文件夹时调用） */
export async function initLocalFolder(): Promise<FileSystemDirectoryHandle | null> {
  // 1. 如果支持原生 showDirectoryPicker，尝试弹出选择器
  if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
    try {
      const handle = await showDirectoryPicker({ mode: 'readwrite' });
      if (handle) {
        cachedRootHandle = handle;
        await localDB.folderHandles.put({ id: ROOT_HANDLE_KEY, handle });
        return handle;
      }
    } catch (err) {
      console.warn('showDirectoryPicker canceled or error:', err);
    }
  }

  // 2. 取消选择或不可用时，返回默认 OPFS 存储
  return getStoredHandle();
}

/** 获取当前的根文件夹句柄 */
export async function getRootHandle(): Promise<FileSystemDirectoryHandle | null> {
  return getStoredHandle();
}

/** 重置本地存储文件夹 */
export async function resetLocalFolder(): Promise<void> {
  cachedRootHandle = null;
  clearUrlCache();
  await localDB.folderHandles.delete(ROOT_HANDLE_KEY);
}

/**
 * 在根目录下创建子目录（如果不存在）
 * 返回子目录句柄
 */
async function ensureDir(
  root: FileSystemDirectoryHandle,
  ...pathSegments: string[]
): Promise<FileSystemDirectoryHandle> {
  let current = root;
  for (const seg of pathSegments) {
    current = await current.getDirectoryHandle(seg, { create: true });
  }
  return current;
}

/** 将 base64 字符串转换为 Blob */
export function base64ToBlob(base64: string, mimeType = 'image/png'): Blob {
  const dataUrlMatch = base64.match(/^data:[^;]+;base64,(.+)$/);
  if (dataUrlMatch) {
    const byteChars = atob(dataUrlMatch[1]);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNums[i] = byteChars.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNums)], { type: mimeType });
  }
  const byteChars = atob(base64);
  const byteNums = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNums[i] = byteChars.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNums)], { type: mimeType });
}

/**
 * 将文件复制到本地存储并返回相对路径
 */
async function copyFileToLocal(
  root: FileSystemDirectoryHandle,
  sourceFile: File | Blob,
  relativePath: string,
  fileName: string,
): Promise<{ relativePath: string; fileName: string }> {
  const pathParts = relativePath.split('/').filter(Boolean);
  const dirName = pathParts.slice(0, -1).join('/');
  const actualFileName = pathParts[pathParts.length - 1] || fileName;

  // 创建目标目录
  const targetDir = await ensureDir(root, ...(dirName ? dirName.split('/') : []));

  // 写入文件
  const fileHandle = await targetDir.getFileHandle(actualFileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(sourceFile);
  await writable.close();

  return { relativePath: `${dirName ? dirName + '/' : ''}${actualFileName}`, fileName: actualFileName };
}

/** 将文件写入本地存储的指定相对路径（供工程包导入使用），root 可传入已获取的句柄避免重复查询 */
export async function saveFileToLocal(
  file: File | Blob,
  relativePath: string,
  root?: FileSystemDirectoryHandle,
): Promise<string | null> {
  const dir = root || (await getRootHandle());
  if (!dir) return null;
  const fileName = relativePath.split('/').filter(Boolean).pop() || 'file';
  const result = await copyFileToLocal(dir, file, relativePath, fileName);
  return result.relativePath;
}

/**
 * 创建本地 uploadBase64 回调（供 getUploadBeforeData 使用）
 * 直接将数据保存到本地文件夹，返回 { storage_path } 格式
 */
export function createLocalUploadBase64(relativeDir: string) {
  return async (params: {
    content: string;
    name: string;
    file_type?: 'image' | 'video' | 'audio' | 'json' | 'txt' | 'font';
  }): Promise<[{ storage_path: string }, null]> => {
    const root = await getRootHandle();
    if (!root) throw new Error('Local storage folder not selected');

    const mimeMap: Record<string, string> = {
      json: 'application/json',
      txt: 'text/plain',
      image: 'image/png',
      video: 'video/mp4',
      audio: 'audio/mpeg',
      font: 'font/ttf',
    };
    const mimeType = mimeMap[params.file_type || ''] || 'image/png';
    const blob = base64ToBlob(params.content, mimeType);

    const result = await copyFileToLocal(root, blob, `${relativeDir}/${params.name}`, params.name);
    return [{ storage_path: result.relativePath }, null];
  };
}

/** 添加素材 */
export async function addMaterial(params: {
  appId: string;
  name: string;
  type: string;
  file: File;
  width?: number;
  height?: number;
  thumbPath?: string;
  framesPath?: string;
  wavePath?: string;
  attrs?: Record<string, any>;
  from?: 'user' | 'system';
  tag?: string;
}): Promise<MaterialRecord | null> {
  const root = await getRootHandle();
  if (!root) {
    Toast.error('Local storage folder not selected. Please reload and try again.');
    return null;
  }

  const { appId, name, type, file, thumbPath, framesPath, wavePath, attrs, from, tag } = params;
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = Date.now();

  // 确定文件夹路径
  const ext = file.name.split('.').pop() || '';
  const safeFileName = `${id}.${ext}`;
  const relativeDir = `materials/${appId}/${type}`;
  const relativePath = `${relativeDir}/${safeFileName}`;

  // 复制主文件
  const fileResult = await copyFileToLocal(root, file, relativePath, safeFileName);

  // 从路径中提取文件名（路径格式：materials/appId/type/xxx.png）
  const extractNameFromPath = (p: string) => p.split('/').pop();
  const thumbFileName = thumbPath ? extractNameFromPath(thumbPath) : undefined;
  const framesFileName = framesPath ? extractNameFromPath(framesPath) : undefined;
  const waveFileName = wavePath ? extractNameFromPath(wavePath) : undefined;

  const record: MaterialRecord = {
    id,
    appId,
    name,
    type,
    fileName: fileResult.fileName,
    relativePath: fileResult.relativePath,
    thumbFileName,
    thumbRelativePath: thumbPath,
    framesFileName,
    framesRelativePath: framesPath,
    waveFileName,
    waveRelativePath: wavePath,
    size: file.size,
    attrs: attrs || {},
    from,
    tag,
    createdAt: now,
    updatedAt: now,
  };

  await localDB.materials.put(record);
  return record;
}

/** 获取素材列表（按 appId 分类） */
export async function getMaterials(appId: string): Promise<MaterialRecord[]> {
  return localDB.materials.where('appId').equals(appId).reverse().sortBy('createdAt');
}

/** 素材显示项（匹配 UI 渲染需要的字段） */
export interface MaterialDisplayItem {
  id: string;
  name: string;
  type: string;
  urls: { url: string; thumb: string };
  attrs: Record<string, any>;
  from?: string;
  tag?: string;
  convert_status?: number; // -1无需处理，0-待处理 1-处理中 2-处理成功 3-处理失败
  _localPath: string; // 本地相对路径，用于后续解析
  _thumbPath?: string; // 封面相对路径（本地模式）
}

/** 获取素材列表并转为可显示的格式 */
export async function getMaterialDisplayItems(appId: string): Promise<MaterialDisplayItem[]> {
  const records = await getMaterials(appId);
  const items: MaterialDisplayItem[] = [];

  for (const rec of records) {
    // 解析文件 URL
    let fileUrl = '';
    try {
      fileUrl = (await getMaterialFileUrl(rec.relativePath)) || '';
    } catch {
      /* ignore */
    }

    // 封面图：从文件读取
    let thumbUrl = '';
    if (rec.thumbRelativePath) {
      try {
        thumbUrl = (await getMaterialFileUrl(rec.thumbRelativePath)) || '';
      } catch {
        /* ignore */
      }
    }

    // 帧预览图：存储相对路径
    let framesPath = '';
    if (rec.framesRelativePath) {
      framesPath = rec.framesRelativePath;
    }

    // 音波数据：存储相对路径
    let wavePath = '';
    if (rec.waveRelativePath) {
      wavePath = rec.waveRelativePath;
    }

    // 类型映射
    const typeMap: Record<string, string> = {
      video: 'video',
      image: 'image',
      audio: 'audio',
      'image/apng': 'image',
      'image/gif': 'image',
      'image/svg': 'image',
    };
    const displayType = typeMap[rec.type] || rec.type;

    items.push({
      id: rec.id,
      name: rec.name,
      type: displayType,
      urls: {
        url: fileUrl,
        thumb: thumbUrl,
      },
      attrs: {
        ...rec.attrs,
        frames: framesPath || rec.attrs.frames || '',
        wave: wavePath || rec.attrs.wave || '',
      },
      from: rec.from,
      tag: rec.tag,
      convert_status: -1,
      _localPath: rec.relativePath,
      _thumbPath: rec.thumbRelativePath,
    });
  }

  return items;
}

/** 将 Blob 转为 base64 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** 解析素材的文件 URL（带缓存避免重复读取） */
const urlCache = new Map<string, string>();
export async function getMaterialFileUrlCached(relativePath: string): Promise<string | null> {
  if (urlCache.has(relativePath)) return urlCache.get(relativePath)!;
  const url = await getMaterialFileUrl(relativePath);
  if (url) urlCache.set(relativePath, url);
  return url;
}

/** 清除 URL 缓存 */
export function clearUrlCache(): void {
  for (const url of urlCache.values()) {
    URL.revokeObjectURL(url);
  }
  urlCache.clear();
}

/** 获取所有素材（按 appId 分组） */
export async function getAllMaterialsGrouped(): Promise<Record<string, MaterialRecord[]>> {
  const all = await localDB.materials.orderBy('createdAt').reverse().toArray();
  const grouped: Record<string, MaterialRecord[]> = {};
  for (const item of all) {
    if (!grouped[item.appId]) grouped[item.appId] = [];
    grouped[item.appId].push(item);
  }
  return grouped;
}

/** 更新素材的帧图/音波/属性数据到 IndexedDB */
export async function updateMaterialAttrs(
  originId: string,
  updates: {
    framesPath?: string;
    wavePath?: string;
    frameScale?: number;
    noAudioTracks?: boolean;
  },
): Promise<void> {
  const record = await localDB.materials.get(originId);
  if (!record) {
    console.warn('[updateMaterialAttrs] 素材不存在:', originId);
    return;
  }

  // 更新帧预览图文件路径
  if (updates.framesPath !== undefined) {
    record.framesFileName = updates.framesPath.split('/').pop();
    record.framesRelativePath = updates.framesPath;
    record.attrs.frames = updates.framesPath;
  }

  // 更新音波数据文件路径
  if (updates.wavePath !== undefined) {
    record.waveFileName = updates.wavePath.split('/').pop();
    record.waveRelativePath = updates.wavePath;
    record.attrs.wave = updates.wavePath;
  }

  // 更新其他属性
  if (updates.frameScale !== undefined) {
    record.attrs.frameScale = updates.frameScale;
  }
  if (updates.noAudioTracks !== undefined) {
    record.attrs.noAudioTracks = updates.noAudioTracks;
  }

  record.updatedAt = Date.now();
  await localDB.materials.put(record);
}

/** 删除素材（同时删除本地文件与内存Blob缓存） */
export async function deleteMaterial(id: string): Promise<void> {
  const record = await localDB.materials.get(id);
  if (!record) return;

  // 释放关联的内存 Blob URL 缓存
  for (const p of [record.relativePath, record.thumbRelativePath, record.framesRelativePath, record.waveRelativePath]) {
    if (p && urlCache.has(p)) {
      URL.revokeObjectURL(urlCache.get(p)!);
      urlCache.delete(p);
    }
  }

  const root = await getRootHandle();
  if (root) {
    // 删除主文件
    try {
      await deleteFileByPath(root, record.relativePath);
    } catch {
      /* 文件可能已被删除 */
    }

    // 删除封面图
    if (record.thumbRelativePath) {
      try {
        await deleteFileByPath(root, record.thumbRelativePath);
      } catch {
        /* 文件可能已被删除 */
      }
    }

    // 删除帧预览图
    if (record.framesRelativePath) {
      try {
        await deleteFileByPath(root, record.framesRelativePath);
      } catch {
        /* 文件可能已被删除 */
      }
    }

    // 删除音波图
    if (record.waveRelativePath) {
      try {
        await deleteFileByPath(root, record.waveRelativePath);
      } catch {
        /* 文件可能已被删除 */
      }
    }
  }

  await localDB.materials.delete(id);
}

/** 根据相对路径删除文件 */
async function deleteFileByPath(root: FileSystemDirectoryHandle, relativePath: string): Promise<void> {
  const parts = relativePath.split('/').filter(Boolean);
  const fileName = parts.pop()!;
  const dirPath = parts.join('/');

  let dir = root;
  if (dirPath) {
    for (const seg of dirPath.split('/')) {
      try {
        dir = await dir.getDirectoryHandle(seg);
      } catch {
        return; // 目录不存在，无需删除
      }
    }
  }

  try {
    await dir.removeEntry(fileName);
  } catch {
    /* 忽略删除失败 */
  }
}

/** 读取本地素材文件为 File 对象（失败返回 null，不弹提示，供打包导出使用） */
export async function getMaterialFile(relativePath: string): Promise<File | null> {
  // 非本地资源，直接跳过
  if (!relativePath.startsWith('materials/')) {
    return null;
  }

  const root = await getRootHandle();
  if (!root) return null;

  try {
    const parts = relativePath.split('/').filter(Boolean);
    const fileName = parts.pop()!;
    const dirPath = parts.join('/');

    let dir = root;
    if (dirPath) {
      for (const seg of dirPath.split('/')) {
        dir = await dir.getDirectoryHandle(seg);
      }
    }

    const fileHandle = await dir.getFileHandle(fileName);
    return await fileHandle.getFile();
  } catch (err) {
    console.warn('读取本地素材文件失败:', relativePath, err);
    return null;
  }
}

// 并发请求去重 Map，避免同一素材并发读取时创建重复 Blob URL
const inFlightUrlPromises = new Map<string, Promise<string | null>>();

/** 读取素材文件为 URL（带内存缓存与并发去重，避免重复读取磁盘与重复生成 Blob URL） */
export async function getMaterialFileUrl(relativePath: string): Promise<string | null> {
  // 非本地资源，直接跳过
  if (!relativePath.startsWith('materials/')) {
    return relativePath;
  }

  // 1. 优先使用已完成的内存缓存
  if (urlCache.has(relativePath)) {
    return urlCache.get(relativePath)!;
  }

  // 2. 检查是否有正在读取中的并发任务
  if (inFlightUrlPromises.has(relativePath)) {
    return inFlightUrlPromises.get(relativePath)!;
  }

  const promise = (async () => {
    try {
      const root = await getRootHandle();
      if (!root) return null;

      const parts = relativePath.split('/').filter(Boolean);
      const fileName = parts.pop()!;
      const dirPath = parts.join('/');

      let dir = root;
      if (dirPath) {
        for (const seg of dirPath.split('/')) {
          dir = await dir.getDirectoryHandle(seg);
        }
      }

      const fileHandle = await dir.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      const url = URL.createObjectURL(file);
      urlCache.set(relativePath, url);
      return url;
    } catch (err) {
      console.error(err);
      console.error('读取素材文件失败:', relativePath);
      Toast.error('Failed to read material file: ' + relativePath);
      return null;
    } finally {
      inFlightUrlPromises.delete(relativePath);
    }
  })();

  inFlightUrlPromises.set(relativePath, promise);
  return promise;
}

/** 保存项目数据 */
export async function saveProject(appId: string, data: any): Promise<void> {
  const existing = await localDB.projects.get(appId);
  await localDB.projects.put({
    id: appId,
    name: existing?.name || data?.name || 'Untitled',
    categoryId: existing?.categoryId || data?.categoryId || '0',
    thumb: existing?.thumb || data?.thumb || '',
    description: existing?.description || data?.description || '',
    data,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now(),
  });
}

/** 获取项目数据 */
export async function getProject(appId: string): Promise<any | null> {
  const record = await localDB.projects.get(appId);
  return record?.data ?? null;
}

/** 删除项目数据 */
export async function deleteProject(appId: string): Promise<void> {
  await localDB.projects.delete(appId);
}

/** 判断本地存储是否已初始化（文件夹句柄已选择） */
export async function isLocalStorageReady(): Promise<boolean> {
  if (!isFSApiSupported()) return false;
  const handle = await getRootHandle();
  return !!handle;
}

// ========== 分类/文件夹 CRUD（用于本地存储模式下的文件夹管理） ==========

/** 获取分类列表 */
export async function getLocalCategoryList(type: 'project' | 'material'): Promise<[any, string | null]> {
  const list = await localDB.categories.where('type').equals(type).toArray();
  return [{ data: list }, null];
}

/** 创建分类 */
export async function createLocalCategory(type: 'project' | 'material', name: string): Promise<[any, string | null]> {
  const id = 'local_cat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const now = Date.now();
  await localDB.categories.put({ id, name, type, createdAt: now, updatedAt: now });
  return [{ data: [{ id, name, type, createdAt: now, updatedAt: now }] }, null];
}

/** 更新分类 */
export async function updateLocalCategory(id: string, data: { name?: string }): Promise<[any, string | null]> {
  const record = await localDB.categories.get(id);
  if (!record) return [null, 'Category does not exist'];
  if (data.name !== undefined) record.name = data.name;
  record.updatedAt = Date.now();
  await localDB.categories.put(record);
  return [record, null];
}

/** 删除分类 */
export async function deleteLocalCategory(ids: string[]): Promise<[any, string | null]> {
  try {
    await localDB.categories.bulkDelete(ids);
    return [true, null];
  } catch (err: any) {
    return [null, err?.message || 'Error deleting category'];
  }
}

/** 获取所有项目列表 */
export async function getAllProjects(): Promise<{ id: string; updatedAt: number }[]> {
  return localDB.projects
    .orderBy('updatedAt')
    .reverse()
    .toArray()
    .then(arr => arr.map(({ id, updatedAt }) => ({ id, updatedAt })));
}

// ========== 项目 CRUD（用于本地存储模式下的草稿列表） ==========

/** 项目列表查询参数 */
interface ProjectListParams {
  page: number;
  page_size: number;
  keyword?: string;
  category_id?: string;
}

/** 创建项目 */
export async function createLocalProject(
  params: {
    name?: string;
    categoryId?: string | number;
    thumb?: string;
    description?: string;
    data?: MovieData;
  },
  category_id?: string | number,
): Promise<[any, string | null]> {
  const id = 'local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const now = Date.now();
  await localDB.projects.put({
    id,
    name: params.name || 'Untitled',
    categoryId: String(category_id || '0'),
    thumb: params.thumb || '',
    description: params.description || '',
    data: params.data,
    createdAt: now,
    updatedAt: now,
  });
  return [{ id, ...params, createdAt: now, updatedAt: now }, null];
}

/** 更新项目元数据 */
export async function updateLocalProjectMeta(
  id: string,
  params: { name?: string; category_id?: string | number; thumb?: string; description?: string },
): Promise<[any, string | null]> {
  const record = await localDB.projects.get(id);
  if (!record) return [null, 'Project does not exist'];
  if (params.name !== undefined) record.name = params.name;
  if (params.category_id !== undefined) record.categoryId = String(params.category_id);
  if (params.thumb !== undefined) record.thumb = params.thumb;
  if (params.description !== undefined) record.description = params.description;
  record.updatedAt = Date.now();
  await localDB.projects.put(record);
  return [record, null];
}

/** 删除项目 */
export async function deleteLocalProject(id: string): Promise<[any, string | null]> {
  await localDB.projects.delete(id);
  return [{ success: true }, null];
}

/** 复制项目 */
export async function copyLocalProject(id: string): Promise<[any, string | null]> {
  const record = await localDB.projects.get(id);
  if (!record) return [null, 'Project does not exist'];
  const newId = 'local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const now = Date.now();
  await localDB.projects.put({
    ...record,
    id: newId,
    name: (record.name || 'Untitled') + ' - Copy',
    createdAt: now,
    updatedAt: now,
  });
  return [{ id: newId, ...record, createdAt: now, updatedAt: now }, null];
}

/** 获取项目列表（带分页/搜索/分类过滤，兼容 Content 组件的 getListServer 接口） */
export async function getLocalProjectList(params: ProjectListParams): Promise<[any, string | null]> {
  let collection = localDB.projects.orderBy('updatedAt').reverse();
  const all: ProjectRecord[] = await collection.toArray();

  let filtered = all;
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(p => p.name?.toLowerCase().includes(kw));
  }
  if (params.category_id !== undefined && params.category_id !== '') {
    filtered = filtered.filter(p => String(p.categoryId || '0') === String(params.category_id));
  }

  const total = filtered.length;
  const start = (params.page - 1) * params.page_size;
  const items = filtered.slice(start, start + params.page_size).map(p => ({
    id: p.id,
    name: p.name || 'Untitled',
    thumb: p.thumb || '',
    category_id: p.categoryId || '0',
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    width: 200,
    height: 180,
    convert_status: -1,
    data: p.data,
  }));

  return [{ data: items, total }, null];
}

/**
 * 将资源中的本地素材路径解析为 blob URL 并缓存到 resourceManage
 * 在数据加载后和新增资源后调用
 * 注意：video-core-sdk 1.0.69 起没有 cacheLocalBlobUrl 方法，需通过 fetchBlob 写入缓存
 */
export async function hydrateResourcePaths(
  resources: Array<{ url?: string; thumb?: string; frames?: string; wave?: string; [key: string]: any }>,
  resourceManage?: { fetchBlob: (path: string) => Promise<string> },
  options?: {
    isCancelled?: () => boolean;
    onPathHydrated?: (path: string) => void;
  },
): Promise<void> {
  if (!resourceManage?.fetchBlob) return;
  if (options?.isCancelled?.()) return;

  const paths: string[] = [];
  for (const res of resources) {
    for (const p of [res.url, res.thumb, res.frames, res.wave]) {
      if (typeof p === 'string' && p.startsWith('materials/')) {
        paths.push(p);
      }
    }
  }

  // Deduplicate paths to avoid redundant parallel decoding
  const uniquePaths = Array.from(new Set(paths));
  if (!uniquePaths.length) return;

  // Parallel hydration with concurrency limit of 8 for optimal I/O throughput
  const CONCURRENCY = 8;
  for (let i = 0; i < uniquePaths.length; i += CONCURRENCY) {
    if (options?.isCancelled?.()) return;
    const chunk = uniquePaths.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async p => {
        if (options?.isCancelled?.()) return;
        try {
          await resourceManage.fetchBlob(p);
          options?.onPathHydrated?.(p);
        } catch (err: any) {
          console.warn('[hydrateResourcePaths] Warning resolving path:', p, err);
        }
      }),
    );
  }
}

/** 批量删除某 appId 下的所有素材 */
export async function deleteAllMaterialsByAppId(appId: string): Promise<void> {
  const materials = await localDB.materials.where('appId').equals(appId).toArray();
  for (const m of materials) {
    await deleteMaterial(m.id);
  }
}
