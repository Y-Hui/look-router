import type { InnerRouteObject } from '../utils/routerImpl'

export type Part<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export const enum PageInstanceType {
  Route,
  Container,
}

export interface PageInstance {
  key: string
  visible: boolean

  pathname: string
  type: PageInstanceType
  reference: number

  children?: PageInstance[]
  parent?: PageInstance

  search?: string
  params?: string
  route: InnerRouteObject
}
