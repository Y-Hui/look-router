import type { FlattenRoute, IndexRouteObject, RouteMeta, RouteObject } from '../types'
import { joinPaths } from './path'

const paramRe = /^:\w+$/
const dynamicSegmentValue = 3
const indexRouteValue = 2
const emptySegmentValue = 1
const staticSegmentValue = 10
const splatPenalty = -2
const isSplat = (s: string) => s === '*'

function computeScore(path: string, index?: boolean) {
  const segments = path.split('/')
  let initialScore = segments.length

  if (segments.some(isSplat)) {
    initialScore += splatPenalty
  }

  if (index) {
    initialScore += indexRouteValue
  }

  return segments
    .filter((s) => !isSplat(s))
    .reduce((score, segment) => {
      let result: number = score
      if (paramRe.test(segment)) {
        result += dynamicSegmentValue
      } else if (segment === '') {
        result += emptySegmentValue
      } else {
        result += staticSegmentValue
      }
      return result
    }, initialScore)
}

export function flattenRoutes(routes: RouteObject[]): FlattenRoute[] {
  const result: FlattenRoute[] = []
  let key = 0

  const flatten = (
    routesArr: (IndexRouteObject | RouteObject)[],
    parentPath = '',
    parentsMeta: RouteMeta[] = [],
  ) => {
    routesArr.forEach((route) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      flattenRoute(route, parentPath, parentsMeta)
    })
  }

  const flattenRoute = (
    route: IndexRouteObject | RouteObject,
    parentPath = '',
    parentsMeta: RouteMeta[] = [],
  ) => {
    if ('index' in route) {
      return
    }

    const { children } = route

    const meta: RouteMeta = {
      relativePath: route.path,
      route,
      routeKey: `route:${(key += 1)}`,
    }

    if (meta.relativePath.startsWith('/')) {
      if (!meta.relativePath.startsWith(parentPath)) {
        throw new Error(
          `Absolute route path "${meta.relativePath}" nested under path ` +
            `"${parentPath}" is not valid. An absolute child route path ` +
            `must start with the combined path of all its parent routes.`,
        )
      }
      meta.relativePath = meta.relativePath.slice(parentPath.length)
    }

    const path = joinPaths([parentPath, meta.relativePath])
    meta.route = { ...meta.route, path }
    const routesMeta = parentsMeta.concat(meta)

    if (Array.isArray(children) && children.length > 0) {
      flatten(children, path, routesMeta)
    }
    result.push({
      path,
      score: computeScore(path),
      routesMeta,
    })
  }

  flatten(routes)

  result.sort((a, b) => {
    return b.score - a.score
  })

  return result
}
