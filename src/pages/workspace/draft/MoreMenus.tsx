import { language } from '@language/index';
import styles from './more.module.less';
import { server } from './server';
import { useRef } from 'react';
import { Copy, Delete, AfferentThree } from '@icon-park/react';
import { Popover, Modal, Toast } from '@douyinfe/semi-ui';
import { pubsub } from '@utils/pubsub';

export interface IProps {
  item: any;
  cates: any[];
  updateContent: (v: number) => void;
}

export default function MoreMenus(props: IProps) {
  const refName = useRef('');
  const { item, cates, updateContent } = props;

  return (
    <ul className={styles.menus}>
      <li
        onClick={() => {
          Modal.confirm({
            title: language.val('confirm_delete'),
            content: language.val('source_delete_confirm_tips'),
            onOk: async () => {
              await server.deleteDraft(item.id);
              // 更新当前列表
              updateContent(+new Date());
            },
          });
        }}
      >
        <Delete theme="outline" size="16" fill="var(--theme-icon)" />
        {language.val('common_delete')}
      </li>
      <Popover
        position="right"
        content={
          <ul className={styles.menus}>
            {cates.map(d => {
              return (
                <li
                  onClick={async () => {
                    pubsub.publish('pageLoading', {
                      start: true,
                    });
                    await server.updateDraft({
                      id: item.id,
                      category_id: d.id,
                    });
                    // 更新当前列表
                    updateContent(+new Date());
                    pubsub.publish('pageLoading', {
                      end: true,
                    });
                    Toast.success(language.val('common_toast_success'));
                  }}
                  key={d.id}
                >
                  {d.name}
                </li>
              );
            })}
          </ul>
        }
      >
        <li>
          <AfferentThree theme="outline" size="16" fill="var(--theme-icon)" />
          {language.val('common_move')}
        </li>
      </Popover>
    </ul>
  );
}
