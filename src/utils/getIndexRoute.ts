import { createElement, type ReactNode } from 'react'

import type { IndexRouteObject, RouteObject } from '../types'

export function getIndexRoute(route?: RouteObject): ReactNode {
  if (!route) return null
  const { children } = route
  const config = children?.find((x) => 'index' in x) as IndexRouteObject | undefined
  return config ? createElement(config.component) : null
}
