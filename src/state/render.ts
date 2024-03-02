/* eslint-disable no-param-reassign */

import type { PageInstance } from '../types'
import { createPageInstance } from '../utils/createPageInstance'
import forEachRight from '../utils/forEachRight'
import type { InnerRouteObject } from '../utils/routerImpl'

type RenderPageArgs = {
  pathname: string
  route: InnerRouteObject
  children?: PageInstance[]
  parent?: PageInstance
  search?: string
}

function renderPage(args: RenderPageArgs) {
  const { route, children, parent, search, pathname } = args

  if (typeof route !== 'object' || route === null || !route?.component) {
    throw Error('[look-router]: Route does not exist')
  }

  return createPageInstance({
    pathname,
    children,
    parent,

    search,
    // TODO:
    // params,
    route,
  })
}

interface RenderArgs {
  pathname: string
  search: string
  matches: InnerRouteObject[]
}

export function renderSinglePage(args: RenderArgs): PageInstance {
  const { matches, search, pathname } = args
  return renderPage({ route: matches[0], search, pathname })
}

export function renderWithNestPage(args: RenderArgs): PageInstance[] {
  const { matches, search, pathname } = args
  const result: PageInstance[] = []

  let children: PageInstance[] | undefined
  const getChildren = () => {
    if (!Array.isArray(children)) return undefined
    return children.slice()
  }
  const updateChildren = (value: PageInstance) => {
    if (Array.isArray(children)) {
      children.push(value)
      return
    }
    children = [value]
  }

  forEachRight(matches, (item) => {
    const isMatched = item.path === pathname
    const page = renderPage({
      route: item,
      search,
      pathname: isMatched ? pathname : item.path,
      children: getChildren(),
    })
    result.unshift(page)
    updateChildren(page)
  })

  forEachRight(result, (item) => {
    item.parent = result.find((x) => x.route.path === item.route.parent)
  })

  return result
}
