import type { History as HistoryImpl } from 'history'
import type { ComponentType, ReactElement, ReactNode } from 'react'

export interface PageComponentProps {
  pathname: string
  visible: boolean
  children?: ReactNode
}

export interface RouteObjectBase {
  path: string
  title?: string
  index?: boolean
  redirectTo?: string
  component?: ComponentType
  children?: RouteObject[]
  pageComponent?: ComponentType<PageComponentProps>
}

export interface NestRouteObject extends Omit<RouteObjectBase, 'component' | 'children'> {
  component: ComponentType<{ children: ReactNode | ReactElement }>
  children: RouteObject[]
}

export type RouteObject = RouteObjectBase | NestRouteObject

export type InnerRouteObject = { $$score: number; parent?: string } & RouteObject

export interface RouterOpts {
  query: Record<string, unknown>
}

export type WatchRoute = {
  path: string
  title: string
  params: Record<string, unknown>
  query: Record<string, unknown>
}

export interface Router extends HistoryImpl {
  mode: 'hash' | 'history'
  routes: RouteObject[]
  flattenRoutes: InnerRouteObject[]
}
