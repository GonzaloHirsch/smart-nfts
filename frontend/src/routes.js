// Code Splitting for routes
const Home = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');
const Components = () => import('./views/Components.vue');
const NotFound = () => import('./views/NotFound.vue');

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  {
    path: '/about',
    meta: { title: 'About' },
    component: About,
  },
  {
    path: '/components',
    meta: { title: 'Components' },
    component: Components,
  },
  { path: '/:path(.*)', component: NotFound },
]
