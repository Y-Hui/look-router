import type { ComponentType } from 'react'

import LookRouter from '../state'
import type { RouteObject, WrapperProps } from '../types/index'

export interface CreateRouterArgs {
  mode?: 'hash' | 'history'
  routes: RouteObject[]
  globalWrapper?: ComponentType<WrapperProps> | null
}

export function createRouter(args: CreateRouterArgs): LookRouter {
  const { mode = 'hash', routes, globalWrapper } = args
  return new LookRouter({ mode, routes, globalWrapper })
}
