import { Action, createBrowserHistory, createHashHistory } from 'history'

import { flattenRoutes } from './flattenRoutes'
import type { RouteObject, Router } from './routerImpl'
import { routerListener } from './routerListener'

export interface CreateRouterArgs {
  mode?: 'hash' | 'history'
  routes: RouteObject[]
}

export function createRouter(args: CreateRouterArgs): Router {
  const { mode = 'hash', routes } = args
  const router = mode === 'history' ? createBrowserHistory() : createHashHistory()

  const _flattenRoutes = flattenRoutes(routes)
  routerListener(router.location, Action.Push, _flattenRoutes)

  return { ...router, mode, routes, flattenRoutes: _flattenRoutes }
}
