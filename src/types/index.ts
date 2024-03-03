import type { ComponentType, ReactElement, ReactNode } from 'react'

export type Part<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

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

/**
 * @internal
 */
export type InternalRouteObject = {
  $$score: number
  parent?: string
  raw: RouteObject
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
  params?: string
  route: InternalRouteObject
  keepAlive?: boolean
}
