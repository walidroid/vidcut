import React, { lazy, Suspense } from 'react';
import { Spin } from '@douyinfe/semi-ui';

const EditorComp = lazy(() => import('./EditorPage'));

const Editor = (props: any) => (
  <Suspense
    fallback={
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1c1c1e',
          color: '#fff',
        }}
      >
        <Spin size="large" />
      </div>
    }
  >
    <EditorComp {...props} />
  </Suspense>
);

const routes = [
  {
    path: '/editor/:appid',
    ssr: false,
    exact: true,
    meta: {
      auth: false,
    },
    component: Editor,
  },
  {
    path: '/editor',
    ssr: false,
    exact: true,
    meta: {
      auth: false,
    },
    component: Editor,
  },
];

export { routes };
