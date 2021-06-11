// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
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
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/',
              name: 'login',
              component: './User/login',
            },
            {
              path: '/user/login',
              name: 'login',
              component: './User/login',
            },
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/utils/Authorized'],
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/workplace',
            },
            {
              name: 'workplace',
              icon: 'dashboard',
              path: '/workplace',
              component: './dashboard/workplace',
            },
            {
              path: '/classes',
              icon: 'table',
              name: 'classes',
              routes: [
                {
                  path: '/',
                  redirect: '/classes/table-list',
                },
                {
                  name: 'classes-list',
                  icon: 'smile',
                  path: '/classes/table-list',
                  component: './classes/classes-list',
                },
                {
                  name: 'add-form',
                  icon: 'smile',
                  path: '/classes/step-form',
                  component: './classes/add-form'
                },
                {
                  name: 'clazz',
                  icon: 'smile',
                  path: '/classes/clazz',
                  component: './classes/clazz'
                },
                {
                  name: 'attendance',
                  icon: 'smile',
                  path: '/classes/attendance',
                  routes: [
                    {
                      name: 'step1',
                      icon: 'smile',
                      path: '/classes/attendance/step1',
                      component: './classes/attendance/step1',
                    },
                    {
                      name: 'step2',
                      icon: 'smile',
                      path: '/classes/attendance/step2',
                      component: './classes/attendance/step2',
                    },
                    {
                      name: 'step3',
                      icon: 'smile',
                      path: '/classes/attendance/step3',
                      component: './classes/attendance/step3',
                    },
                    {
                      name: 'step4',
                      icon: 'smile',
                      path: '/classes/attendance/step4',
                      component: './classes/attendance/step4',
                    },
                  ],
                },
                {
                  name: 'qrcode',
                  icon: 'smile',
                  path: '/classes/qrcode',
                  component: './classes/success'
                },
                
              ],
            },
            {
              name: 'account',
              icon: 'user',
              path: '/account',
              routes: [
                {
                  path: '/',
                  redirect: '/account/center',
                },
                {
                  name: 'center',
                  icon: 'smile',
                  path: '/account/center',
                  component: './account/center',
                },
                {
                  name: 'settings',
                  icon: 'smile',
                  path: '/account/settings',
                  component: './account/settings',
                },
              ],
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
});
