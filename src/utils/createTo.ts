import { parsePath, type Path, type To } from 'history'
import type { MatchedRoute } from 'src/types'

function resolvePathname(relativePath: string, fromPathname: string): string {
  const segments = fromPathname.replace(/\/+$/, '').split('/')
  const relativeSegments = relativePath.split('/')

  relativeSegments.forEach((segment) => {
    if (segment === '..') {
      if (segments.length > 1) segments.pop()
    } else if (segment !== '.') {
      segments.push(segment)
    }
  })

  return segments.length > 1 ? segments.join('/') : '/'
}

export function createTo(
  toArg: To,
  locationPathname: string,
  matches: MatchedRoute[],
): Partial<Path> {
  const to = typeof toArg === 'string' ? parsePath(toArg) : toArg
  const { pathname: toPathname } = to

  if (
    !toPathname ||
    toPathname?.includes('#') ||
    toPathname?.includes('?') ||
    (to.search && to.search.includes('#'))
  ) {
    throw Error(`不能包含 #?`)
  }

  if (toPathname.startsWith('/')) {
    return to
  }

  const routePathnames = matches.map((x) => x.pathname)

  if (toPathname.startsWith('..')) {
    let routePathnameIndex = routePathnames.length - 1
    const toSegments = toPathname.split('/')
    while (toSegments[0] === '..') {
      toSegments.shift()
      routePathnameIndex -= 1
    }
    const from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : '/'
    to.pathname = resolvePathname(toSegments.join('/'), from)
  } else {
    to.pathname = resolvePathname(toPathname, locationPathname)
  }
  return to
}