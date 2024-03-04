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
} & Pick<RouteObject, 'path'>

/**
 * @internal
 */
export interface LookStackPage {
  key: string
  visible: boolean

  /**
   * 路由渲染时的 path，不是路由配置的 path
   *
   * 例如:
   * 路由配置      /user/:id
   * 跳转到        /user/1
   * 那么这里的值为 /user/1
   */
  pathname: string
  children?: LookStackPage[]
  parent?: LookStackPage

  search?: string
  params?: Params<string>
  route: InternalRouteObject
  keepAlive?: boolean
}
