import Vue2 from '@vitejs/plugin-vue2'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import monkey, { util } from 'vite-plugin-monkey'
import Package from './package.json'

// https://vitejs.dev/config/
export default ({ command = 'dev', mode = 'dev' }) => {
  console.log('当前构造环境为', mode)
  console.log('当前执行命令为', command)

  return defineConfig(
    {
      define: {
        'process.env': {
          VITE_TAMPERMONKEY_APP_ENVIRONMENT: mode === 'prod' ? 'production' : 'development',
          VITE_APPVERSION: Package.version,
        },
      },
      resolve: {
        alias: {
          '@': '/src',
          'vue': 'vue/dist/vue.esm.js', // Use the full build of Vue for better compatibility
        },
      },
      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true,
            additionalData: '@import "./src/styles/global.less";', // 加载全局样式，使用less特性
          },
        },
      },
      plugins: [
        Vue2(),
        AutoImport({
          dts: 'src/auto-imports.d.ts',
          imports: [
            'vue',
            util.unimportPreset,
          ],
          dirs: [
            'src/modules/**',
            'src/constants.js',
          ],
        }),
        monkey({
          entry: 'src/main.js',
          userscript: {
            'namespace': Package.name,
            'name': Package.name,
            'version': Package.version, // Update version as needed
            'description': '任意网页提供部分漫画网站搜索；漫画分章节下载(可直接下载/压缩下载/拼接下载)，可用于动漫之家、极速漫画、腾讯漫画、哔哩哔哩等35多个网站；对个别漫画网站修改阅读样式；可按需编写定义规则JSON导入以支持其他漫画网站',
            'author': Package.author,
            'match': '*',
            'resource': {
              vantcss: 'https://unpkg.com/vant@2.13.8/lib/index.css',
            },
            'connect': '*',
            'grant': [
              'unsafeWindow',
              'GM_xmlhttpRequest',
              'GM_addStyle',
              'GM_getResourceText',
              'GM_download',
              'GM_registerMenuCommand',
            ],
            'run-at': 'document-start',
            'include': '*',
            'license': 'GPLv3',
          },
          server: {
            mountGmApi: true,
          },
          build: {
            externalGlobals: {
              // vue: 'Vue',
              // 'element-ui': 'element-ui',
              vue: ['Vue', 'https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.min.js'],
              jszip: ['JSZip', 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'],
              vant: ['vant', 'https://cdn.jsdelivr.net/npm/vant@2.13.8/lib/vant.min.js'],
            },
          },
        }),
      ],
    },
  )
}
