import type { Location as HistoryLocation } from 'history'
import { Action } from 'history'

import { popRoute, pushRoute, replaceRoute } from '../state/stack'
import type { InnerRouteObject } from './routerImpl'

function getMatches(pathname: string, routes: InnerRouteObject[]) {
  const result: InnerRouteObject[] = []

  let match: string | undefined = pathname
  while (match !== undefined) {
    // eslint-disable-next-line no-loop-func
    const item = routes.find((v) => v.path === match!)
    if (item !== undefined) {
      match = item.parent
      result.push(item)
    } else {
      break
    }
  }

  return result.reverse()
}

export function routerListener(
  location: HistoryLocation,
  action: Action,
  routes: InnerRouteObject[],
) {
  const { pathname, key } = location
  // const index = stack.findIndex((v) => v.key === key)
  // const index = stack.findIndex((v) => v.pathname === pathname)

  const matches = getMatches(pathname, routes)

  if (matches.length === 0) {
    throw Error(`${pathname} does not exist`)
  }

  const render = {
    [Action.Push]: () => {
      pushRoute(location, matches)
      // if (index === -1) {
      //   addPage(key, matches)
      // } else if (index !== stack.length - 1) {
      //   movePageToEnd(index, matches)
      // }
    },
    [Action.Replace]: () => {
      replaceRoute(location, matches)
      // if (index > -1 && index === stack.length - 1) return
      // replacePage(key, matches)
    },
    [Action.Pop]: () => {
      popRoute(location, matches)
      // if (index === -1) {
      //   render[Action.Replace]()
      // } else if (index !== stack.length - 1) {
      //   replacePageByIndex(index, matches)
      // }
    },
  }
  render[action]()
}
