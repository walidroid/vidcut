import BasicService from '@server/BasicService';
import {
  createLocalProject,
  updateLocalProjectMeta,
  deleteLocalProject,
  copyLocalProject,
  getLocalProjectList,
  deleteAllMaterialsByAppId,
  getProject,
} from '@services/localStorageService';

class Server extends BasicService {
  /** 初始化并检测本地存储模式 (纯本地离线模式始终为 true) */
  private async _ensureInit(): Promise<boolean> {
    return true;
  }

  // 获取系统素材列表
  getSysMaterialList = async (params: any) => {
    return [{ data: [], total: 0 }, null];
  };

  /** 创建项目 */
  createDraft = async (data: any) => {
    return createLocalProject(data);
  };

  /** 获取作品最大数量信息（本地模式无限制） */
  getAppCountInfo = async () => {
    return [{ max: 999 }, null];
  };

  /** 获取项目列表 */
  getDraftList = async (params: any) => {
    return getLocalProjectList(params);
  };

  /** 获取作品详情 */
  getAppsDetail = async (id: string) => {
    const data = await getProject(id);
    return [data ? { id, data } : null, null];
  };

  /** 发布作品（本地模式不需要） */
  publishApps = async (params: any) => {
    return [{}, null];
  };

  /** 删除项目 */
  deleteDraft = async (id: string) => {
    // 同时删除关联的素材
    deleteAllMaterialsByAppId(id).catch(() => {});
    return deleteLocalProject(id);
  };

  /** 更新项目 */
  updateDraft = async (params: any) => {
    return updateLocalProjectMeta(params.id, params);
  };

  /** 移动项目 */
  moveDraft = async (params: { ids: string[]; category_id: string }) => {
    await Promise.all(params.ids.map((id: string) => updateLocalProjectMeta(id, { category_id: params.category_id })));
    return [{}, null];
  };

  /** 复制项目 */
  copyDraft = async (params: any) => {
    return copyLocalProject(params.id ?? params);
  };
}

export const server = new Server();
