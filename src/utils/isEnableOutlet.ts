import type { RouteObject } from '../types'

export default function isEnableOutlet(page?: RouteObject) {
  if (!page) return false
  return Array.isArray(page.children) && page.children.length > 0
}
