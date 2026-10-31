import React from 'react';
import { renderRoutes } from 'react-router-config';
import PageLoading from '@components/page-loading';
import { observer } from 'mobx-react';

function HomeLayout({ route }: any) {
  return (
    <>
      <PageLoading />
      {renderRoutes(route.routes)}
    </>
  );
}
export default observer(HomeLayout);
