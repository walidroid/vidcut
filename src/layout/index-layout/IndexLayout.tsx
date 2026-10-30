import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import { userService } from '@server/index';
import PageLoading from '@components/page-loading';
import { observer } from 'mobx-react';
import { stores } from '@stores/index';
import FolderGuard from '@components/folder-guard/FolderGuard';

function IndexLayout({ route }: any) {
  const { user } = stores;

  useEffect(() => {
    if (user.token && user.info?.id === 'local_user') {
      userService.getUserDetail();
    }
  }, []);

  return (
    <FolderGuard>
      <PageLoading />
      {renderRoutes(route.routes)}
    </FolderGuard>
  );
}
export default observer(IndexLayout);
