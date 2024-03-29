import type { Hash, Location, Pathname, Search, To } from 'history'
import type { ComponentType, ReactElement, ReactNode } from 'react'

export type Part<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type SearchParams = Record<string, string | string[]>

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined | string[]
}

export type { Location, To }

export interface Path {
  pathname: Pathname
  search?: Search
  hash?: Hash
}

export interface WrapperProps {
  pathname?: string
  children?: ReactNode
}

/**
 * Interface to type `meta` fields in route records.
 *
 * @example
 *
 * ```ts
 * // typings.d.ts or router.ts
 * import 'look-router';
 *
 * declare module 'look-router' {
 *   interface Meta {
 *     requiresAuth?: boolean
 *   }
 *  }
 * ```
 */
export declare interface Meta extends Record<string | number | symbol, unknown> {}

export interface IndexRouteObject {
  index: true
  component: ComponentType
}

export interface RouteObjectBase {
  path: string
  /**
   * 重定向到其他页面，支持相对路径
   */
  redirectTo?: To | ((location: Location) => To)
  component?: ComponentType
  children?: (RouteObject | IndexRouteObject)[]
  wrapper?: ComponentType<WrapperProps> | null
  meta?: Meta
}

export interface NestRouteObject extends Omit<RouteObjectBase, 'component' | 'children'> {
  component: ComponentType<{ children: ReactNode | ReactElement }>
  children: (RouteObject | IndexRouteObject)[]
}

export type RouteObject = RouteObjectBase | NestRouteObject

export type BlockerArgs = {
  proceed: () => void
  to: Path
  from: Path
}

export type Blocker = (args: BlockerArgs) => void

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
  routeKey: string

  search?: string
  params?: Params<string>
  route: RouteObject & { parentRouteKey?: string }
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
export type RouteMeta = { relativePath: string; route: RouteObject; routeKey: string }

export type MatchedRoute = {
  routeKey: string
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
