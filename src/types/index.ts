import type { Location, To } from 'history'
import type { ComponentType, ReactElement, ReactNode } from 'react'

export type Part<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type SearchParams = Record<string, string | string[]>

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined | string[]
}

export interface WrapperProps {
  pathname?: string
  children?: ReactNode
}

export interface RouteObjectBase {
  path: string
  index?: boolean
  redirectTo?: To | ((location: Location) => To)
  component?: ComponentType
  children?: RouteObject[]
  wrapper?: ComponentType<WrapperProps> | null
  meta?: Record<PropertyKey, unknown>
}

export interface NestRouteObject extends Omit<RouteObjectBase, 'component' | 'children'> {
  component: ComponentType<{ children: ReactNode | ReactElement }>
  children: RouteObject[]
}

export type RouteObject = RouteObjectBase | NestRouteObject

/**
 * @private
 */
export type CompiledPathParam = { paramName: string; isOptional?: boolean }

/**
 * @private
 */
export interface LookStackPage {
  key: string
  visible: boolean

  /** 真实路由 */
  pathname: string
  children?: LookStackPage[]
  parent?: LookStackPage

  search?: string
  params?: Params<string>
  route: RouteObject & { parentPath?: string }
  keepAlive?: boolean
  matches: MatchedRoute[]
}

/**
 * @private
 */
export type FlattenRoute = {
  path: string
  routesMeta: RouteMeta[]
  score: number
}

/**
 * @private
 */
export type RouteMeta = { relativePath: string; route: RouteObject }

export type MatchedRoute = {
  /** 路由参数 */
  params: Params
  /** 真实路由 */
  pathname: string
  pathnameBase: string
  /** URL Search */
  search: string
  /** 路由配置 */
  route: RouteObject
}
