// 配置
const config = {
  secretKey: 'x&S#acLCx', //
  apiHost: '/api/v1',
  editorHost: '/editor',
  prefix: 'vidcut', // Project storage prefix
  // resourcesHost: '', // CDN资源路径
  loginSuccessLink: '/workspace/draft', // 登录成功后跳转地址
  resourcesHost: '', // CDN资源路径
  basename: '', // history路由前缀
  env: 'dev',
  EModuleEffectSourcePath: '/assets/effectcanvas/',
  workerPath: '/assets/worker',
  host: '', // 二维码扫描有用到
};

// 生产环境参数
if (import.meta.env.PROD) {
  config.editorHost = '/editor';
  config.env = 'prod';
  // config.resourcesHost = 'https://videomix.h5ds.com';
  // config.apiHost = (window as any).apiHost || '';
}

export { config };
