import React from 'react';
import { Redirect } from 'react-router-dom';

const RedirectToWorkspace = () => React.createElement(Redirect, { to: '/workspace/draft' });

const routes = [
  {
    path: '/',
    ssr: true,
    exact: true,
    component: RedirectToWorkspace,
  },
  {
    path: '/home',
    ssr: true,
    exact: true,
    component: RedirectToWorkspace,
  },
];

export { routes };
