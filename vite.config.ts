import { defineConfig } from 'vite';
//@ts-ignore
import path from 'path';
import react from '@vitejs/plugin-react';
import vitePluginImp from 'vite-plugin-imp';
import { visualizer } from 'rollup-plugin-visualizer';

//@ts-ignore
const resolve = url => path.resolve(__dirname, url);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@components': resolve('./src/components'),
      '@server': resolve('./src/server'),
      '@pages': resolve('./src/pages'),
      '@language': resolve('./src/language'),
      '@hooks': resolve('./src/hooks'),
      '@theme': resolve('./src/theme'),
      '@layout': resolve('./src/layout'),
      '@stores': resolve('./src/stores'),
      '@utils': resolve('./src/utils'),
      '@config': resolve('./src/config'),
      '@less': resolve('./src/less'),
      '@images': resolve('./src/assets/images'),
      '@icons': resolve('./src/icons'),
      '@plugins': resolve('./src/pages/editor/plugins'),
      '@database': resolve('./src/database'),
      '@services': resolve('./src/services'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
      },
    }),
    vitePluginImp({
      libList: [
        {
          libName: '@icon-park/react',
          libDirectory: 'es/icons',
          camel2DashComponentName: false,
        },
        {
          libName: 'lodash',
          libDirectory: '',
          camel2DashComponentName: false,
        },
      ],
    }),
  ],
  css: {
    modules: {
      generateScopedName: '[name]__[local]__[hash:5]',
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        chunkFileNames: 'homeAssets/js/[name]-[hash].js',
        entryFileNames: 'homeAssets/js/[name]-[hash].js',
        assetFileNames: 'homeAssets/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('video-core-sdk') || id.includes('pixi.js') || id.includes('@pixi')) {
              return 'vendor-editor';
            }
            if (id.includes('@douyinfe/semi-icons') || id.includes('@icon-park')) {
              return 'vendor-icons';
            }
            if (id.includes('@douyinfe/semi-ui')) {
              return 'vendor-semi';
            }
            if (id.includes('react') || id.includes('mobx') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('echarts') || id.includes('zrender')) {
              return 'vendor-charts';
            }
            if (id.includes('lodash') || id.includes('dayjs') || id.includes('axios') || id.includes('dexie') || id.includes('fflate')) {
              return 'vendor-utils';
            }
          }
        },
      },
      input: {
        main: resolve('index.html'),
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
  },
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3005,
    proxy: {
      '/cgi-bin': {
        target: 'https://video.h5ds.com',
        changeOrigin: true,
      },
      '/api': {
        target: 'https://video.h5ds.com',
        changeOrigin: true,
      },
    },
  },
});
