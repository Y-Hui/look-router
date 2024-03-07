import { parsePath, type To } from 'history'

import type { MatchedRoute, Path } from '../types'
import { normalizeHash, normalizeSearch } from './path'

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

function resolvePath(to: To, fromPathname = '/'): Path {
  const {
    pathname: toPathname,
    search = '',
    hash = '',
  } = typeof to === 'string' ? parsePath(to) : to

  // eslint-disable-next-line no-nested-ternary
  const pathname = toPathname
    ? toPathname.startsWith('/')
      ? toPathname
      : resolvePathname(toPathname, fromPathname)
    : fromPathname

  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash),
  }
}

export function createTo(toArg: To, matches: MatchedRoute[]): Path {
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

  let from: string
  // 处理 falsy
  if (toPathname == null) {
    from = routePathnames[routePathnames.length - 1] || '/'
  } else {
    const isPathRelative = !toPathname.startsWith('/')
    let routePathnameIndex = routePathnames.length - 1
    if (!isPathRelative && toPathname.startsWith('..')) {
      const toSegments = toPathname.split('/')
      while (toSegments[0] === '..') {
        toSegments.shift()
        routePathnameIndex -= 1
      }
      to.pathname = toSegments.join('/')
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : '/'
  }
  const path = resolvePath(to, from)
  return path
}
