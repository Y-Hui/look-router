import type { ComponentType, ReactElement, ReactNode } from 'react'

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

export type InnerRouteObject = { $$score: number; parent?: string } & RouteObject
