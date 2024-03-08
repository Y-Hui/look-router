import type { LookStackPage, MatchedRoute } from '../types'
import forEachRight from '../utils/forEachRight'
import { globalKey } from '../utils/globalKey'

type RenderPageArgs = {
  matched: MatchedRoute
  matches: MatchedRoute[]
  children?: LookStackPage[]
}

function renderPage(args: RenderPageArgs): LookStackPage {
  const { matched, matches, children } = args
  const { route, pathname, search, params } = matched
  if (typeof route !== 'object' || route === null || !route) {
    throw Error('[look-router]: Route does not exist')
  }

  return {
    visible: false,
    key: globalKey.new(),
    routeKey: matched.routeKey,

    pathname,
    children,
    parent: undefined,

    search,
    params,
    route: { ...route, parentRouteKey: undefined },
    matches,
  }
}

interface RenderArgs {
  matches: MatchedRoute[]
}

export function renderSinglePage(args: RenderArgs): LookStackPage {
  const { matches } = args
  return renderPage({ matched: matches[0], matches })
}

export function renderWithNestPage(args: RenderArgs): LookStackPage[] {
  const { matches } = args
  const result: LookStackPage[] = []

  let children: LookStackPage[] | undefined
  forEachRight(matches, (item, index) => {
    const page = renderPage({
      matched: item,
      children,
      matches: matches.slice(0, index + 1),
    })
    children?.forEach((child) => {
      // eslint-disable-next-line no-param-reassign
      child.parent = page
      // eslint-disable-next-line no-param-reassign
      child.route.parentRouteKey = page.routeKey
    })
    result.unshift(page)
    children = [page]
  })

  return result
}
