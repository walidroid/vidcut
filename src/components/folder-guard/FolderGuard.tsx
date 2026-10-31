import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, Typography } from '@douyinfe/semi-ui';
import { FolderOpen } from '@icon-park/react';
import { initLocalFolder, getRootHandle, isFSApiSupported } from '@services/localStorageService';
import { language } from '@language/index';

interface FolderGuardProps {
  children: React.ReactNode;
}

const FolderGuard: React.FC<FolderGuardProps> = ({ children }) => {
  const supported = isFSApiSupported();
  const [folderReady, setFolderReady] = useState(false);
  const [folderLoading, setFolderLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    getRootHandle()
      .then(handle => {
        if (mounted) {
          // OPFS or selected folder is ready
          setFolderReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setFolderReady(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleInitFolder = useCallback(async () => {
    setFolderLoading(true);
    try {
      await initLocalFolder();
    } catch (e) {
      console.warn('Init local folder:', e);
    } finally {
      setFolderLoading(false);
      setFolderReady(true);
    }
  }, []);

  if (folderReady || !supported) {
    return <>{children}</>;
  }

  const lang = language.getLanguage();

  const labels = {
    'fr-FR': {
      title: 'Sélectionnez un dossier de stockage local',
      desc: 'Veuillez sélectionner un dossier local pour enregistrer vos projets et vos médias. Vos fichiers restent privés et ne sont jamais téléversés.',
      btn: 'Choisir un dossier',
    },
    'ar-SA': {
      title: 'اختيار مجلد التخزين المحلي',
      desc: 'يرجى اختيار مجلد محلي لحفظ الوسائط ومشاريع التحرير. ملفاتك تظل خاصة تماماً داخل جهازك.',
      btn: 'اختيار المجلد',
    },
    'en-US': {
      title: 'Select Local Storage Folder',
      desc: 'Please select a local folder to store materials and project data. Files remain private on your computer and are never uploaded to a server.',
      btn: 'Choose Folder',
    },
  }[lang] || {
    title: 'Select Local Storage Folder',
    desc: 'Please select a local folder to store materials and project data. Files remain private on your computer and are never uploaded to a server.',
    btn: 'Choose Folder',
  };

  return (
    <Modal
      visible={true}
      closable={false}
      maskClosable={false}
      footer={null}
      title={null}
      style={{ maxWidth: 480 }}
      bodyStyle={{ textAlign: 'center', padding: '40px 32px' }}
    >
      <FolderOpen size={64} fill="#1677ff" style={{ marginBottom: 24 }} />
      <Typography.Title heading={4} style={{ marginBottom: 12 }}>
        {labels.title}
      </Typography.Title>
      <Typography.Text type="tertiary" style={{ marginBottom: 24, display: 'block' }}>
        {labels.desc}
      </Typography.Text>
      <Button
        theme="solid"
        type="primary"
        size="large"
        loading={folderLoading}
        onClick={handleInitFolder}
        block
      >
        {labels.btn}
      </Button>
    </Modal>
  );
};

export default FolderGuard;
