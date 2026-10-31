import React from 'react';
import Item from '../components/item';
import { Modal, Space, TextArea, Toast, Tooltip } from '@douyinfe/semi-ui';
import { stores } from '@stores/index';
import type { ImageElement } from 'video-core-sdk';
import { util } from '@utils/index';
import { CodeDownload, DownPicture } from '@icon-park/react';

type Props = {};

const ImageData = (props: Props) => {
  const { editor } = stores;
  const element = editor.getElementData() as ImageElement;

  return (
    <Item
      title="Raw Data"
      extra={
        <Space>
          <Tooltip content="Show Parameters">
            <a
              onClick={() => {
                // 获取参数
                console.log('elements', editor.scale);
                Toast.success('Inspect data in console');
                const resources = editor.data.resouces.filter(item => element.resourceId === item.id);

                Modal.confirm({
                  title: 'Element Data',
                  content: (
                    <>
                      <TextArea
                        rows={8}
                        value={JSON.stringify(
                          {
                            width: element.style.width / editor.scale,
                            height: element.style.height / editor.scale,
                            data: [element],
                            resources: resources,
                          },
                          null,
                          2,
                        )}
                      />
                    </>
                  ),
                });
              }}
            >
              <CodeDownload size={20} color="var(--theme-icon)" />
            </a>
          </Tooltip>
          <Tooltip content="Download Original">
            <a
              onClick={async () => {
                const resource = editor.data.resouces.find(item => element.resourceId === item.id);
                if (!resource?.url) {
                  Toast.error('Invalid resource URL');
                  return;
                }
                const url = editor.movie.reURL(resource.url);
                try {
                  const res = await fetch(url);
                  const blob = await res.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = blobUrl;
                  a.download = resource.name || 'image.png';
                  a.click();
                  URL.revokeObjectURL(blobUrl);
                } catch {
                  Toast.error('Download failed');
                }
              }}
            >
              <DownPicture size={20} color="var(--theme-icon)" />
            </a>
          </Tooltip>
        </Space>
      }
    ></Item>
  );
};

export default ImageData;
