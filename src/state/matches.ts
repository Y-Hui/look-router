import type { Location } from 'history'

import type { FlattenRoute, MatchedRoute, Mutable, Params } from '../types'
import { compilePath } from '../utils/compilePath'
import { decodePath } from '../utils/decodePath'
import { joinPaths, normalizePathname } from '../utils/path'

function matchRouteBranch(
  pathname: string,
  search: string,
  branch: FlattenRoute,
): MatchedRoute[] | null {
  const result: MatchedRoute[] = []
  const { routesMeta } = branch

  const matchedParams: Params = {}
  let matchedPathname: string = '/'
  for (let j = 0; j < routesMeta.length; j += 1) {
    const meta = routesMeta[j]
    const { route } = meta
    const end = j === routesMeta.length - 1
    const { matcher, compiledParams } = compilePath(meta.relativePath, end)
    const remainingPathname =
      matchedPathname === '/' ? pathname : pathname.slice(matchedPathname.length) || '/'
    const match = remainingPathname.match(matcher)
    if (!match) return null

    const captureGroups = match.slice(1)
    const params = compiledParams.reduce<Mutable<Params>>(
      (memo, { paramName, isOptional }, i) => {
        const value = captureGroups[i]
        if (isOptional && !value) {
          // eslint-disable-next-line no-param-reassign
          memo[paramName] = undefined
        } else {
          // eslint-disable-next-line no-param-reassign
          memo[paramName] = (value || '').replace(/%2F/g, '/')
        }
        return memo
      },
      {},
    )
    const value = {
      params,
      pathname: match[0],
      pathnameBase: match[0].replace(/(.)\/+$/, '$1'),
    }

    Object.assign(matchedParams, value.params)
    const newItem: MatchedRoute = {
      params: matchedParams,
      pathname: joinPaths([matchedPathname, value.pathname]),
      route,
      pathnameBase: normalizePathname(joinPaths([matchedPathname, value.pathnameBase])),
      search: '',
    }
    if (newItem.pathname === pathname && search.length > 0) {
      newItem.search = search.startsWith('?') ? search : `?${search}`
    }
    result.push(newItem)

    if (value.pathnameBase !== '/') {
      matchedPathname = joinPaths([matchedPathname, value.pathnameBase])
    }
  }
  return result
}

export function getMatches(
  location: Pick<Location, 'pathname' | 'search'>,
  routes: FlattenRoute[],
) {
  let result = null
  for (let i = 0; result === null && i < routes.length; i += 1) {
    const pathname = decodePath(location.pathname)
    result = matchRouteBranch(pathname, location.search, routes[i])
  }
  return result
}
