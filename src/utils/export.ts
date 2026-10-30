import { helper, MovieEncoding } from 'video-core-sdk';
import { config } from '../config';
import { plugins } from '@plugins/index';
import { getMaterialFileUrl } from '@services/localStorageService';
import type { IWatermark, MovieData } from 'video-core-sdk';

/**
 * 预解析本地素材为 blob URL 并写入导出实例的缓存。
 *
 * 导出的音频合成链路 getAllMedia → fetchFile 取的是 resourceManage 的 blob 缓存，
 * 而导出 Movie 的 loadUsedResource 是不等待的后台任务，音频编码启动时缓存往往还没就绪，
 * 会拿到未解析的 materials/ 相对地址（fetch 回 index.html），导致 FFmpeg 合成失败、
 * 导出收尾死循环（控制台反复输出「音频已经编码--> false」）。
 * 必须在 me.run() 之前显式 await 完成预解析。
 */
async function prewarmLocalMaterials(me: any, data: MovieData): Promise<void> {
  const resourceManage = me?._movie?.resourceManage || me?.current?.resourceManage;
  if (!resourceManage?.fetchBlob) {
    return;
  }
  const paths = new Set<string>();
  for (const res of (data.resouces || []) as Array<Record<string, any>>) {
    for (const p of [res.url, res.thumb, res.frames, res.wave]) {
      if (typeof p === 'string' && p.startsWith('materials/')) {
        paths.add(p);
      }
    }
  }
  await Promise.all(
    [...paths].map(p =>
      resourceManage.fetchBlob(p).catch((err: any) => {
        console.warn('导出预解析本地素材失败:', p, err);
        return null;
      }),
    ),
  );
}

export const exportMovie = async (params: {
  format: 'mp4' | 'gif' | 'mp3';
  fps: number;
  resolution: '480P' | '720P' | '1080P' | '2K' | '4K';
  data: MovieData;
  resourcesHost?: string;
  EModuleEffectSourcePath?: string;
  workerPath?: string;
  watermark?: IWatermark;
  onBefore: (obj: any) => Promise<any>;
  onFinish: (obj: any) => Promise<any>;
  onProgress: (obj: any) => void;
  onError: (obj: any) => void;
  name?: string;
  gifTimes?: number[];
  gifWidth?: number;
  gifFps?: number;
  gifSpeed?: number;
}) => {
  const { onFinish, onBefore, onProgress, data, resourcesHost, EModuleEffectSourcePath, workerPath, ...other } = params;
  const values: any = {
    ...other,
  };

  // 历史工程中 audio 素材可能被误标 noAudioTracks=true（音频合成时会被直接排除，导致导出无声音）。
  // 音频必然存在音轨，导出前强制修正；使用浅拷贝避免改动编辑器内的数据
  const exportData: MovieData = {
    ...data,
    resouces: (data.resouces || []).map(r =>
      r.type === 'audio' && r.noAudioTracks ? { ...r, noAudioTracks: false } : r,
    ),
  } as MovieData;
  const totalTime = helper.getTotalTime(data);
  if (values.gifTimes) {
    values.gifTimes[1] = totalTime;
  }
  let progress = { sourceLoad: 0, encoderAudio: 0, encoderVideo: 0, eachSourceLoad: 0, eachSourceName: '' };
  await onBefore({ totalTime });
  onProgress({ ...progress });

  console.log('xxxxxxxxxxxxxxxx', values);
  if (resourcesHost) {
    config.resourcesHost = resourcesHost;
  }
  if (EModuleEffectSourcePath) {
    config.EModuleEffectSourcePath = EModuleEffectSourcePath;
  }
  if (workerPath) {
    config.workerPath = workerPath;
  }

  const me = new MovieEncoding({
    // id: 'Stats-output',
    ...values,
    gifWorkerPath: config.workerPath + '/gif.worker.js',
    workerPath: config.workerPath + '/decode.worker.js',
    resourceHost: config.resourcesHost,
    EModuleEffectSourcePath: config.EModuleEffectSourcePath,
    plugins: plugins,
    movieData: exportData,
    // 本地存储模式下 materials/ 路径需要解析为 blob URL，否则导出时音频/视频素材无法加载
    getMaterialFileUrl: getMaterialFileUrl,
    watermark: params.watermark,
    // renderEnv: 'web',
    times: values.format === 'gif' ? values.gifTimes : undefined,
    initSuccess: () => {
      console.log('初始化成功');
    },
    onReady: async () => {
      // 判断是否有缓存数据
      // if (await me.current.getCacheIndexDBData()) {
      //   Toast.warning('浏览器发生过意外关闭，将从上次任务继续导出');
      // }
      console.log('onReady=---->', values);

      // 先等本地素材全部解析成 blob URL，再开始编码（音频合成依赖此缓存）
      await prewarmLocalMaterials(me, exportData);

      if (values.format === 'mp4') {
        await me.run();
      }

      if (values.format === 'mp3') {
        const audioURL = await me.encoderAudio();
        // console.log('audioURL', audioURL);
        me.downURL(audioURL, `${values.name || +new Date()}.mp3`);
      }
      // console.timeEnd('run');
    },
    onEachSourceProgress: n => {
      progress.eachSourceLoad = n.p;
      progress.eachSourceName = n.src.split('/').pop();
      onProgress({ ...progress });
    },
    onProgress: v => {
      if (values.format === 'mp3' && v.type === 'encoderAudio' && v.progress === 1) {
        // 音频合成over
        setTimeout(() => {
          onFinish({ url: me.remixAudioURL });
          // me.destroy();
        }, 1000);
      }
      progress[v.type] = v.progress;
      onProgress({ ...progress });
    },
    onFinish: url => {
      onFinish({ url });
      // me.destroy();
    },
  });

  return me;
};
