// Code Splitting for routes
// Not split Home for less layout shift ==> Better experience
import Home from './views/Home.vue';
const ContractEditor = () => import('./views/ContractEditor.vue');
const Interact = () => import('./views/Interact.vue');
const Showcase = () => import('./views/Showcase.vue');
const Status = () => import('./views/Status.vue');
const NotFound = () => import('./views/NotFound.vue');
const ServerError = () => import('./views/ServerError.vue');

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
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
    path: '/tokens/:id?',
    meta: { title: 'Tokens' },
    component: Showcase,
  },
  {
    path: '/status',
    meta: { title: 'Status' },
    component: Status,
  },
  {
    path: '/500',
    meta: { title: '500' },
    component: ServerError,
  },
  { path: '/400', meta: { title: '400' }, component: NotFound, props: true },
  { path: '/:path(.*)', component: NotFound, props: true },
]
