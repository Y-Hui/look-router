import { createElement, lazy } from 'react'
import { createHashRouter } from 'react-router-dom'

export const router = createHashRouter([
  {
    path: '/',
    element: createElement(lazy(() => import('./pages/tabs/index'))),
    children: [
      {
        path: '/home',
        element: createElement(lazy(() => import('./pages/tabs/home'))),
      },
      {
        path: '/search',
        element: createElement(lazy(() => import('./pages/tabs/search'))),
      },
      {
        path: '/notifications',
        element: createElement(lazy(() => import('./pages/tabs/notifications'))),
      },
      {
        path: '/messages',
        element: createElement(lazy(() => import('./pages/tabs/messages'))),
      },
    ],
  },
  {
    path: '/details/:id',
    element: createElement(lazy(() => import('./pages/details'))),
  },
  {
    path: '*',
    element: createElement(lazy(() => import('./pages/404'))),
  },
])
