import type { InternalRouteObject, RouteObject } from '../types'
import { compilePath } from './compilePath'

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

export function flattenRoutes(routes: RouteObject[]): InternalRouteObject[] {
  let stack = routes.slice()
  const result: InternalRouteObject[] = []

  let currentNestRoot: RouteObject[] = []
  while (stack.length >= 1) {
    const route = stack.shift()!
    const { children } = route
    if (
      Array.isArray(children) &&
      children.length > 0 &&
      !currentNestRoot.includes(route)
    ) {
      currentNestRoot.push(route)
      stack = [...children, route].concat(stack)
    } else {
      const parentRoute = currentNestRoot[currentNestRoot.length - 1]
      let parent = parentRoute?.path

      if (route === parentRoute) {
        parent = currentNestRoot[currentNestRoot.length - 2]?.path
      }

      if (currentNestRoot.includes(route)) {
        currentNestRoot = currentNestRoot.filter((x) => x !== route)
      }

      const { matcher, compiledParams } = compilePath(route.path)
      result.push({
        ...route,
        raw: route,
        $$score: computeScore(route.path),
        parent,
        matcher,
        compiledParams,
        match: (pathname: string) => matcher.test(pathname),
      })
    }
  }

  result.sort((a, b) => {
    return b.$$score - a.$$score
  })

  return result
}
