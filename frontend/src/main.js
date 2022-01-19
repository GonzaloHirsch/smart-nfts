import { createApp } from 'vue';
import './tailwind.css';
import App from './App.vue';
import { routes } from './routes.js';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import { createMetaManager } from 'vue-meta';
import locales from '@/locales';

// Custom plugins
import { apiPlugin } from './plugins/api';
import { notificationsPlugin } from './plugins/notifications';

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const i18n = createI18n({
  locale: navigator.language,
  fallbackLocale: 'en',
  messages: locales,
  datetimeFormats: {
    'en': {
      short: {
        month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
      },
      long: {
        year: 'numeric', month: 'short', day: 'numeric',
        weekday: 'short', hour: 'numeric', minute: 'numeric'
      }
    },
    'es': {
      short: {
        month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
      },
      long: {
        year: 'numeric', month: 'short', day: 'numeric',
        weekday: 'short', hour: 'numeric', minute: 'numeric'
      }
    }
  }
})

const meta = createMetaManager();

app.use(router);
app.use(i18n);
app.use(meta);

// Custom plugins
app.use(apiPlugin);
app.use(notificationsPlugin);

app.mount('#app');
