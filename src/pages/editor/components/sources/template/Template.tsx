import Source from '@pages/editor/common/source';
import styles from './template.module.less';
import $ from 'jquery';
import type { MovieData } from 'video-core-sdk';
import { util } from '@utils/index';
import { transaction } from 'mobx';
import { Modal } from '@douyinfe/semi-ui';
import { stores } from '@stores/index';
import { language } from '@language/index';

export default function Template() {
  const { editor } = stores;
  const lang = language.getLanguage();

  const msg = {
    'fr-FR': {
      title: 'Confirmation',
      content: 'Le remplacement du modèle écrasera le projet actuel. Voulez-vous continuer ?',
    },
    'ar-SA': {
      title: 'تأكيد',
      content: 'استبدال القالب سيؤدي إلى مسح محتوى المشروع الحالي. هل تود المتابعة؟',
    },
    'en-US': {
      title: 'Confirm Template Replacement',
      content: 'Applying this template will replace current project content. Do you want to continue?',
    },
  }[lang] || {
    title: 'Confirm Template Replacement',
    content: 'Applying this template will replace current project content. Do you want to continue?',
  };

  return (
    <Source
      type="template"
      item={(d: any) => {
        return <img src={editor.movie.reURL(d.thumb)} />;
      }}
      itemClassName={styles.imgItem}
      addItem={item => {
        Modal.confirm({
          title: msg.title,
          content: msg.content,
          onOk: async () => {
            try {
              const json = await $.get(editor.movie.reURL(item.url + '?t=' + +new Date()));
              transaction(() => {
                editor.data = util.reJSON(json) as MovieData;
                editor.movieDataUpdateKey = util.randomID();
              });
            } catch (err) {
              console.warn('Load template:', err);
            }
          },
        });
      }}
    />
  );
}
