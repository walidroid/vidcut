import { routes as userRouter } from './pages/user';
import { routes as workspaceRouter } from './pages/workspace';
import { routes as agreementRouter } from './pages/agreement';
import { routes as editorRouter } from './pages/editor';

// Layout components
import NotFound from '@components/not-found';
import IndexLayout from '@layout/index-layout';
import UserLayout from '@layout/user-layout';
import WorkspaceLayout from '@layout/workspace-layout';
import AgreementLayout from '@layout/agreement-layout';

const routes = [
  {
    path: '/editor/:appId',
    exact: false,
    meta: { auth: false },
    component: IndexLayout,
    routes: [...editorRouter],
  },
  {
    path: '/workspace',
    exact: false,
    meta: { auth: false },
    component: WorkspaceLayout,
    routes: [...workspaceRouter],
  },
  {
    path: '/user/agreement',
    exact: false,
    meta: { auth: false },
    component: AgreementLayout,
    routes: [agreementRouter[0]],
  },
  {
    path: '/user/privacy',
    exact: false,
    meta: { auth: false },
    component: AgreementLayout,
    routes: [agreementRouter[1]],
  },
  {
    path: '/user/vipService',
    exact: false,
    meta: { auth: false },
    component: AgreementLayout,
    routes: [agreementRouter[2]],
  },
  {
    path: '/user',
    exact: false,
    meta: { auth: false },
    component: UserLayout,
    routes: [...userRouter],
  },
  {
    path: '/',
    exact: false,
    component: WorkspaceLayout,
    meta: { auth: false },
    routes: [...workspaceRouter, { path: '*', exact: false, component: NotFound }],
  },
];

export { routes };
