// Code Splitting for routes
const Home = () => import('./views/Home.vue');
const Create = () => import('./views/Create.vue');
const Components = () => import('./views/Components.vue');
const ContractEditor = () => import('./views/ContractEditor.vue');
const Interact = () => import('./views/Interact.vue');
const NotFound = () => import('./views/NotFound.vue');

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  {
    path: '/create',
    meta: { title: 'Create' },
    component: Create,
  },
  {
    path: '/create/:id',
    meta: { title: 'Contract Editor' },
    component: ContractEditor,
  },
  {
    path: '/interact/:id?',
    meta: { title: 'Interact' },
    component: Interact,
  },
  {
    path: '/components',
    meta: { title: 'Components' },
    component: Components,
  },
  { path: '/:path(.*)', component: NotFound },
]
