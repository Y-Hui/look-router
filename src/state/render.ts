import type { LookStackPage, MatchedRoute } from '../types'
import forEachRight from '../utils/forEachRight'
import { globalKey } from '../utils/globalKey'

type RenderPageArgs = {
  matched: MatchedRoute
  children?: LookStackPage[]
}

function renderPage(args: RenderPageArgs): LookStackPage {
  const { matched, children } = args
  const { route, pathname, search, params } = matched
  if (typeof route !== 'object' || route === null || !route) {
    throw Error('[look-router]: Route does not exist')
  }

  return {
    visible: false,
    key: globalKey.new(),

    pathname,
    children,
    parent: undefined,

    search,
    params,
    route: { ...route, parentPath: undefined },
  }
}

interface RenderArgs {
  matches: MatchedRoute[]
}

export function renderSinglePage(args: RenderArgs): LookStackPage {
  const { matches } = args
  return renderPage({ matched: matches[0] })
}

export function renderWithNestPage(args: RenderArgs): LookStackPage[] {
  const { matches } = args
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
    const newChildren = getChildren()
    const page = renderPage({
      matched: item,
      children: newChildren,
    })
    newChildren?.forEach((child) => {
      // eslint-disable-next-line no-param-reassign
      child.parent = page
      // eslint-disable-next-line no-param-reassign
      child.route.parentPath = page.route.path
    })
    result.unshift(page)
    updateChildren(page)
  })

  return result
}
