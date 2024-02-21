import type { InnerRouteObject, RouteObject } from './routerImpl'

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

export function flattenRoutes(routes: RouteObject[]): InnerRouteObject[] {
  let stack = routes.slice()
  const result: InnerRouteObject[] = []

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

      result.push({
        ...route,
        $$score: computeScore(route.path),
        parent,
      })
    }
  }

  result.sort((a, b) => {
    return b.$$score - a.$$score
  })

  return result
}
