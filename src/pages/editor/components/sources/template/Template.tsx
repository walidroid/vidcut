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
      okText: 'Confirmer',
      cancelText: 'Annuler',
    },
    'ar-SA': {
      title: 'تأكيد',
      content: 'استبدال القالب سيؤدي إلى مسح محتوى المشروع الحالي. هل تود المتابعة؟',
      okText: 'تأكيد',
      cancelText: 'إلغاء',
    },
    'en-US': {
      title: 'Confirm Template Replacement',
      content: 'Applying this template will replace current project content. Do you want to continue?',
      okText: 'Confirm',
      cancelText: 'Cancel',
    },
  }[lang] || {
    title: 'Confirm Template Replacement',
    content: 'Applying this template will replace current project content. Do you want to continue?',
    okText: 'Confirm',
    cancelText: 'Cancel',
  };

  return (
    <Source
      type="template"
      item={(d: any) => {
        const thumbUrl = d.thumb || d.urls?.thumb || '';
        return <img src={editor.movie.reURL(thumbUrl)} alt={d.name || ''} />;
      }}
      itemClassName={styles.imgItem}
      addItem={item => {
        Modal.confirm({
          title: msg.title,
          content: msg.content,
          okText: msg.okText,
          cancelText: msg.cancelText,
          onOk: async () => {
            try {
              const targetUrl = item.url || item.urls?.url;
              if (!targetUrl) return;
              const json = await $.get(editor.movie.reURL(targetUrl + '?t=' + +new Date()));
              const movieData = util.reJSON(json) as MovieData;

              // Pre-fetch blobs for any resources in the template
              if (editor.movie?.resourceManage && movieData.resouces) {
                for (const res of movieData.resouces) {
                  if (res.url) {
                    try {
                      await editor.movie.resourceManage.fetchBlob(res.url);
                    } catch (e) {
                      console.warn('Fetch template resource blob error:', e);
                    }
                  }
                }
              }

              transaction(() => {
                editor.data = movieData;
                editor.movieDataUpdateKey = util.randomID();
              });
              editor.updateMovie();
              editor.updateTimeline();
            } catch (err) {
              console.warn('Load template:', err);
            }
          },
        });
      }}
    />
  );
}
