import type { InternalRouteObject, LookStackPage } from '../types'
import forEachRight from '../utils/forEachRight'
import { globalKey } from '../utils/globalKey'

type RenderPageArgs = {
  pathname: string
  route: InternalRouteObject
  children?: LookStackPage[]
  parent?: LookStackPage
  search?: string
}

function renderPage(args: RenderPageArgs) {
  const { route, children, parent, search, pathname } = args

  if (typeof route !== 'object' || route === null || !route?.component) {
    throw Error('[look-router]: Route does not exist')
  }

  return {
    visible: false,
    key: globalKey.new(),

    pathname,
    children,
    parent,

    search,
    // TODO:
    // params,
    route,
  }
}

interface RenderArgs {
  pathname: string
  search: string
  matches: InternalRouteObject[]
}

export function renderSinglePage(args: RenderArgs): LookStackPage {
  const { matches, search, pathname } = args
  return renderPage({ route: matches[0], search, pathname })
}

export function renderWithNestPage(args: RenderArgs): LookStackPage[] {
  const { matches, search, pathname } = args
  const result: LookStackPage[] = []

  let children: LookStackPage[] | undefined
  const getChildren = () => {
    if (!Array.isArray(children)) return undefined
    return children.slice()
  }
  const updateChildren = (value: LookStackPage) => {
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
    // eslint-disable-next-line no-param-reassign
    item.parent = result.find((x) => x.route.path === item.route.parent)
  })

  return result
}
