import React, { useState } from 'react';
import { Button, Modal, Toast, Upload } from '@douyinfe/semi-ui';
import styles from './project.module.less';
import { helper } from 'video-core-sdk';
import { util } from '@utils/index';
import { exportProjectZip } from '@utils/projectExport';
import { importProjectZip } from '@utils/projectImport';
import dayjs from 'dayjs';
import { Intl, language } from '@language/index';
import { stores } from '@stores/index';

type Props = {};

const Project = (props: Props) => {
  const { editor } = stores;
  const [visible, setVisible] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');

  // 导出工程文件（JSON + 全部素材打包为 zip）
  const handleExport = async () => {
    if (exporting) return;
    const ndata = editor.movie.sortZIndexNewData();
    // 去掉重复的resource
    editor.movie.clearUnUsedResource(ndata);
    setExporting(true);
    setExportProgress('');
    try {
      const res = await exportProjectZip(ndata, `${ndata.title}_${dayjs().format('YYYYMMDDHHmmss')}`, {
        onProgress: (done, total) => setExportProgress(`${done}/${total}`),
      });
      if (res.failed.length > 0) {
        console.warn('导出时获取失败的素材:', res.failed);
        Toast.warning({
          content: language.val('header_project_export_partial', {
            success: res.success,
            failed: res.failed.length,
          }),
          duration: 5,
        });
      } else {
        Toast.success(language.val('header_project_export_success'));
      }
    } catch (err) {
      console.error('导出工程文件失败:', err);
      Toast.error(language.val('header_project_export_failed'));
    } finally {
      setExporting(false);
      setExportProgress('');
    }
  };
  return (
    <>
      <Button
        onClick={() => {
          setVisible(true);
        }}
      >
        <Intl name="header_project_file" />
      </Button>
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
      >
        <div className={styles.uploadProject}>
          <h1>
            <Intl name="header_project_title" />
          </h1>
          <div className={styles.item}>
            <Upload
              draggable={true}
              customRequest={() => {}}
              action=''
              showUploadList={false}
              accept=".json,.zip,application/json,application/zip,application/x-zip-compressed"
              dragMainText={language.val('header_project_upload_tip1')}
              dragSubText={language.val('header_project_upload_tip2')}
              onChange={e => {
                const file = e.currentFile?.fileInstance;
                if (!file) return;
                const isZip = /\.zip$/i.test(file.name);
                Modal.confirm({
                  title: language.val('header_project_confirm_title'),
                  content: language.val('header_project_confirm_content'),
                  onOk: async () => {
                    try {
                      let ndata: any;
                      if (isZip) {
                        // zip 工程包：解压素材到本地存储目录，并改写工程内的素材地址
                        const res = await importProjectZip(file, editor.appid);
                        ndata = res.data;
                        if (res.skipped.length > 0) {
                          console.warn('工程包导入时写入失败/缺失的素材:', res.skipped);
                          Toast.warning(
                            language.val('header_project_import_partial', { failed: res.skipped.length }),
                          );
                        }
                      } else {
                        ndata = await util.fileToJson(file);
                      }
                      if (util.checkNdata(ndata)) {
                        // 校验合法性
                        await editor.apiServer.updateApp({
                          id: editor.appid,
                          name: ndata.title,
                          data: ndata,
                          width: ndata.width,
                          height: ndata.height,
                          duration: helper.getTotalTime(ndata),
                        });
                        location.reload();
                      } else {
                        Toast.error(language.val('header_project_toast'));
                      }
                    } catch (err: any) {
                      // importProjectZip 抛出的 message 为语言 key
                      const msg = typeof err?.message === 'string' ? err.message : '';
                      Toast.error(language.val(msg.startsWith('header_project_') ? msg : 'header_project_zip_invalid'));
                    }
                  },
                });
              }}
            ></Upload>
          </div>
          <div className={styles.item}>
            <Button onClick={handleExport} block type="primary" loading={exporting}>
              <Intl name="header_project_export" />
              {exporting && exportProgress ? ` (${exportProgress})` : ''}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Project;
