// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import modules from '../src/modules';
const path = require('path');

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: false,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'en-US',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: false,
  },
  chainWebpack(config, { webpack }) {
    config.target('electron-renderer');
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {...modules.TENANTS},
            {...modules.PROPERTIES},
            {...modules.LANDLORDS},
            {...modules.USERS},
            {...modules.ROLES},
            {...modules.INVOICES},
            {...modules.RECEIPTS},
            {...modules.COMPLAINTS},
            {...modules.OCCUPATION},
            {
              path: '/appsettings',
              name: 'Settings',
              icon: 'smile',
              component: './AppSettings',
            },
            {
              path: '/properties/:id',
              component: './Properties/ManageUnits',
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  // ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  publicPath: './', 
  runtimePublicPath: true,
  history:{ 
  type:'hash'
  }
});
