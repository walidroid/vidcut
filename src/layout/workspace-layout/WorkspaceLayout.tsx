import styles from './workspaceLayout.module.less';

import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import { userService } from '@server/index';
import PageLoading from '@components/page-loading';
import { inject, observer } from 'mobx-react';
import { user } from '@stores/user';
import Header from '@components/header';
import FolderGuard from '@components/folder-guard/FolderGuard';

function WorkspaceLayout({ route }: any) {
  useEffect(() => {
    if (user.token && user.info?.id === 'local_user') {
      userService.getUserDetail();
    }
  }, []);

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
