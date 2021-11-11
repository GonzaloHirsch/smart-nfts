import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import locales from '@/locales';

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const i18n = createI18n({
  locale: navigator.language,
  fallbackLocale: 'en',
  messages: locales
})

app.use(router)
app.use(i18n)
app.mount('#app')
