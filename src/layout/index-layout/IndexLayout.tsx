import React from 'react';
import { renderRoutes } from 'react-router-config';
import PageLoading from '@components/page-loading';
import { observer } from 'mobx-react';
import FolderGuard from '@components/folder-guard/FolderGuard';

function IndexLayout({ route }: any) {
  return (
    <FolderGuard>
      <PageLoading />
      {renderRoutes(route.routes)}
    </FolderGuard>
  );
}
export default observer(IndexLayout);
