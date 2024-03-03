import LookRouter from '../state'
import type { RouteObject } from '../types/index'

export interface CreateRouterArgs {
  mode?: 'hash' | 'history'
  routes: RouteObject[]
}

export function createRouter(args: CreateRouterArgs): LookRouter {
  const { mode = 'hash', routes } = args
  return new LookRouter({ mode, routes })
}
