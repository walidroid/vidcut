import styles from './workspaceLayout.module.less';

import React from 'react';
import { renderRoutes } from 'react-router-config';
import PageLoading from '@components/page-loading';
import { inject, observer } from 'mobx-react';
import Header from '@components/header';
import FolderGuard from '@components/folder-guard/FolderGuard';

function WorkspaceLayout({ route }: any) {
  return (
    <FolderGuard>
      <Header />
      <PageLoading />
      <div className={styles.workspaceLayout}>
        <div className={styles.content}>{renderRoutes(route.routes)}</div>
      </div>
    </FolderGuard>
  );
}
export default inject('user')(observer(WorkspaceLayout));
