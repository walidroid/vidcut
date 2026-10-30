import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import { userService } from '@server/index';
import PageLoading from '@components/page-loading';
import { observer } from 'mobx-react';
import { user } from '@stores/user';

function HomeLayout({ route }: any) {
  useEffect(() => {
    if (user.token && user.info?.id === 'local_user') {
      userService.getUserDetail();
    }
  }, []);

  return (
    <>
      <PageLoading />
      {renderRoutes(route.routes)}
    </>
  );
}
export default observer(HomeLayout);
