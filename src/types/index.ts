import type { ComponentType, ReactElement, ReactNode } from 'react'

export type Part<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined
}

export interface PageComponentProps {
  pathname: string
  visible: boolean
  children?: ReactNode
}

export interface RouteObjectBase {
  path: string
  index?: boolean
  redirectTo?: string
  component?: ComponentType
  children?: RouteObject[]
  pageComponent?: ComponentType<PageComponentProps>
  meta?: Record<PropertyKey, unknown>
}

export interface NestRouteObject extends Omit<RouteObjectBase, 'component' | 'children'> {
  component: ComponentType<{ children: ReactNode | ReactElement }>
  children: RouteObject[]
}

export type RouteObject = RouteObjectBase | NestRouteObject

export type CompiledPathParam = { paramName: string; isOptional?: boolean }

/**
 * @internal
 */
export type InternalRouteObject = {
  $$score: number
  parent?: string
  raw: RouteObject
  matcher: RegExp
  compiledParams: CompiledPathParam[]
  /** 输入一个 pathname，检查与当前的路由配置是否匹配 */
  match: (pathname: string) => boolean
} & RouteObject

/**
 * @internal
 */
export interface LookStackPage {
  key: string
  visible: boolean

  pathname: string
  children?: LookStackPage[]
  parent?: LookStackPage

  search?: string
  params?: Params<string>
  route: InternalRouteObject
  keepAlive?: boolean
}
