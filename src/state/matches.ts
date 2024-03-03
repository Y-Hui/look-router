import type { InternalRouteObject } from '../types'

export function getMatches(pathname: string, routes: InternalRouteObject[]) {
  const result: InternalRouteObject[] = []

  const matched = routes.find((route) => route.match(pathname))
  let routePath: string | undefined = matched?.path
  while (routePath !== undefined) {
    // eslint-disable-next-line no-loop-func
    const item = routes.find((v) => v.path === routePath!)
    if (item !== undefined) {
      routePath = item.parent
      result.unshift(item)
    } else {
      break
    }
  }

  return result
}
