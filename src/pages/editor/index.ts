import Editor from './EditorPage';

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
