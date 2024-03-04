import { createRouter } from 'look-router'
import { lazy } from 'react'

export const router = createRouter({
  routes: [
    {
      path: '/',
      redirectTo: '/home',
      component: lazy(() => import('./pages/tabs/index')),
      children: [
        {
          path: '/home',
          component: lazy(() => import('./pages/tabs/home')),
          meta: {
            title: '首页',
          },
        },
        {
          path: '/search',
          component: lazy(() => import('./pages/tabs/search')),
          meta: {
            title: '搜索',
          },
        },
        {
          path: '/notifications',
          component: lazy(() => import('./pages/tabs/notifications')),
          meta: {
            title: '通知',
          },
        },
        {
          path: '/messages',
          component: lazy(() => import('./pages/tabs/messages')),
          meta: {
            title: '私信',
          },
        },
      ],
    },
    {
      path: '/details/:id',
      component: lazy(() => import('./pages/details')),
      meta: {
        title: '详情页',
      },
    },
    {
      path: '*',
      component: lazy(() => import('./pages/404')),
      meta: {
        title: '404',
      },
    },
  ],
})

// @ts-ignore
window.router = router
