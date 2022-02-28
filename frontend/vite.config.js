import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'

export default ({ mode }) => {
  // Load env, https://stackoverflow.com/questions/66389043/how-can-i-use-vite-env-variables-in-vite-config-js
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [vue(), svgLoader(), createHtmlPlugin({
      minify: true,
      /**
       * If you want to store `index.html` in the specified folder, you can modify it, otherwise no configuration is required
       * @default index.html
       */
      template: 'index.html',

      /**
       * Data that needs to be injected into the index.html ejs template
       */
      inject: {
        data: {
          recaptchaScript: `<script defer src="https://www.google.com/recaptcha/api.js?render=${process.env.VITE_RECAPTCHA_KEY}"></script>`,
        },
      },
    })],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      open: true,
    },
    build: {
      minify: 'esbuild'
    }
  })
}
