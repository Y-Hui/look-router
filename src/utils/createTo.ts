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

export function createTo(toArg: To, matches: MatchedRoute[]): Partial<Path> {
  const to = typeof toArg === 'string' ? parsePath(toArg) : toArg
  const { pathname: toPathname, search } = to

  if (
    (toPathname && (toPathname?.includes('#') || toPathname?.includes('?'))) ||
    (search && search.includes('#'))
  ) {
    throw Error(
      `\n<Link to="..."> Error\n` +
        `1. pathname cannot contain # or /\n` +
        `2. search cannot contain #\n`,
    )
  }

  const routePathnames = matches.map((x) => x.pathname)

  // 处理 falsy
  if (toPathname == null) {
    const from = routePathnames[routePathnames.length - 1] || '/'
    to.pathname = from
  } else {
    if (toPathname?.startsWith('/')) {
      return to
    }
    let routePathnameIndex = routePathnames.length - 1
    const toSegments = toPathname.split('/')
    while (toSegments[0] === '..') {
      toSegments.shift()
      routePathnameIndex -= 1
    }
    const from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : '/'
    to.pathname = resolvePathname(toSegments.join('/'), from)
  }
  return to
}
