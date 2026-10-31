import {
  UploadOne,
  PictureOne,
  Video,
  Music,
  MoreTwo,
  Text,
  ColorFilter,
  Effects,
  InvertCamera,
  InnerShadowBottomLeft,
  TextMessage,
  Page,
} from '@icon-park/react';
import Custom from './Custom';

const fill = 'var(--theme-icon)';
export const sides = [
  {
    icon: <Page theme="outline" size="24" fill={fill} />,
    type: 'custom',
    name: 'Custom',
    enName: 'Custom',
    panel: Custom,
  },
  {
    icon: <Page theme="outline" size="24" fill={fill} />,
    type: 'template',
    name: 'Template', // 模板
    simple: true,
    enName: 'Template',
  },
  {
    icon: <UploadOne theme="outline" size="24" fill={fill} />,
    type: 'my',
    name: 'My', // 我的
    simple: true,
    enName: 'My',
  },
  {
    icon: <TextMessage theme="outline" size="24" fill={fill} />,
    type: 'caption',
    name: 'Caption', // 字幕
    enName: 'Caption',
  },
  {
    icon: <PictureOne theme="outline" size="24" fill={fill} />,
    type: 'image',
    name: 'Image', // 图片
    simple: true,
    enName: 'Image',
  },
  {
    icon: <Video theme="outline" size="24" fill={fill} />,
    type: 'video',
    simple: true,
    name: 'Video', // 视频
    enName: 'Video',
  },
  {
    icon: <Music theme="outline" size="24" fill={fill} />,
    type: 'audio',
    name: 'Audio', // 音频
    enName: 'Audio',
  },
  {
    icon: <Text theme="outline" size="24" fill={fill} />,
    type: 'text',
    name: 'Text', // 文字
    enName: 'Text',
  },
  {
    icon: <InnerShadowBottomLeft theme="outline" size="24" fill={fill} />,
    type: 'lottie',
    name: 'Sticker', // 贴纸
    enName: 'Sticker',
  },
  {
    icon: <ColorFilter theme="outline" size="24" fill={fill} />,
    type: 'filter',
    name: 'Filter', // 滤镜
    enName: 'Filter',
  },
  {
    icon: <Effects theme="outline" size="24" fill={fill} />,
    type: 'effect',
    name: 'Effect', // 特效
    enName: 'Effect',
  },
  {
    icon: <InvertCamera theme="outline" size="24" fill={fill} />,
    type: 'transition',
    name: 'Transition', // 转场
    enName: 'Transition',
  },
  {
    icon: <MoreTwo theme="outline" size="24" fill={fill} />,
    type: 'more',
    name: 'More', // 更多
    enName: 'More',
  },
];
