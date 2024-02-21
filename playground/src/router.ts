import { createRouter } from 'look-router'
import { lazy } from 'react'

import Page from './Page'

export const router = createRouter({
  routes: [
    {
      path: '/',
      component: lazy(() => import('./pages/index')),
      children: [
        {
          path: '/tab/1',
          title: 'Tab1',
          component: lazy(() => import('./pages/tabs/tab1')),
          pageComponent: Page,
        },
        {
          path: '/tab/2',
          title: 'Tab2',
          component: lazy(() => import('./pages/tabs/tab2')),
          pageComponent: Page,
        },
      ],
    },
    {
      path: '/home',
      title: '首页',
      component: lazy(() => import('./pages/home')),
    },
    {
      path: '/tab',
      component: lazy(() => import('./pages/tabs')),
    },
    {
      path: '/details/:id',
      title: '详情页',
      component: lazy(() => import('./pages/details')),
    },
    {
      path: '/details',
      title: '详情页',
      component: lazy(() => import('./pages/details')),
    },
    {
      path: '/list',
      title: '详情页',
      component: lazy(() => import('./pages/list')),
    },
  ],
})

window.router = router
