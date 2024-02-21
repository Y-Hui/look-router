/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

import type { Location as HistoryLocation } from 'history'

import { PageInstance, PageInstanceType } from '../types'
import { createPageInstance } from '../utils/createPageInstance'
import forEachRight from '../utils/forEachRight'
import pageHistory, { PageHistory } from '../utils/pageHistory'
import stack, { PageStack } from '../utils/pageStack'
import type { InnerRouteObject } from '../utils/routerImpl'

function flushPageStack() {
  const getChildren = (pages: PageInstance[], parent: PageInstance) => {
    return pages.filter((item) => item.route.parent === parent.route.path)
  }

  const newStack = stack.stack
    .reduce((result, item) => {
      if (item.type !== PageInstanceType.Route) {
        result.push(item)
      } else {
        const key = PageHistory.encode({
          pathname: item.pathname,
          search: item.search || '',
        })
        const count = pageHistory.countMap[key]
        if (count !== undefined) {
          item.reference = count.count
          result.push(item)
        }
      }
      return result
    }, [] as PageInstance[])
    .map((item, _i, arr) => {
      if (Array.isArray(item.route.children)) {
        item.children = getChildren(arr, item)
        item.children.forEach((child) => (child.parent = item))
        return item
      }
      return item
    })

  stack.setStack(newStack)

  return newStack
}

type DisplayPageArgs = {
  key?: string
  pathname: string
  search?: string
}
function displayPages(args?: DisplayPageArgs) {
  stack.stack.forEach((item) => {
    item.visible = false
  })
  if (args !== undefined) {
    const route = stack.find(args)!
    const returns = PageStack.getReturns(route)
    returns.forEach((item) => {
      item.visible = true
    })
  }
}

type RenderPageArgs = {
  pathname: string
  page: InnerRouteObject
  children?: PageInstance[]
  parent?: PageInstance
  search?: string
  type?: PageInstanceType
}
function renderPage(args: RenderPageArgs) {
  const { page, children, parent, search, pathname, type } = args

  if (typeof page !== 'object' || page === null || !page?.component) {
    throw Error('[look-router]: Route does not exist')
  }

  return createPageInstance({
    pathname,
    children,
    parent,

    search,
    // TODO:
    // params,
    route: page,
    type,
  })
}

interface RenderArgs {
  pathname: string
  search: string
  matches: InnerRouteObject[]
}
function renderSinglePage(args: RenderArgs): PageInstance {
  const { matches, search, pathname } = args
  return renderPage({ page: matches[0], search, pathname })
}
function renderWithNestPage(args: RenderArgs): PageInstance[] {
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
      page: item,
      search,
      pathname: isMatched ? pathname : item.path,
      type: isMatched ? PageInstanceType.Route : PageInstanceType.Container,
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
/*

[/tab/1, /list, /tab/2, /detail]
[/, /tab/1, /list, /tab/2, /detail]

/tab2 --> 直接复用 /tab/2
/tab3 --> 追加到 / 中，设置 parent = /

[/tab/1, /list, /tab/2, /detail]
[/, /tab, /tab/1, /list, /tab/2, /detail]

/tab2 --> 直接复用 /tab/2
/tab3 --> 追加到 /tab 中，设置 parent = /tab
 */
function mergeNestPage(pages: PageInstance[]) {
  const orphans: PageInstance[] = []
  forEachRight(pages, (item) => {
    const args = { pathname: item.pathname, search: item.search }
    if (stack.has(args)) {
      stack.reuse(args)
    } else {
      orphans.unshift(item)
    }
  })
  orphans.forEach((item) => {
    const parent = stack.stack.find((x) => x.route.path === item.route.parent)
    item.parent = parent
    if (parent !== undefined) {
      if (Array.isArray(parent.children)) {
        // 由于 orphans 是从父路由开始添加，父路由中已经包含了子路由，
        // 所以可以使用 includes 判断
        if (!parent.children.includes(item)) {
          parent.children.push(item)
        }
      } else {
        parent.children = [item]
      }
    }
    stack.push(item)
  })
}

export function pushRoute(location: HistoryLocation, matches: InnerRouteObject[]) {
  const { pathname, search } = location
  const args = { pathname, search }

  if (!Array.isArray(matches) || matches?.length === 0) {
    throw Error('[look-router]: Route does not exist')
  }

  pageHistory.push(args)

  // 跳转新页面时发现页面已存在
  if (stack.has(args)) {
    const route = stack.reuse(args)
    displayPages({ key: route.key, pathname, search })
    return
  }

  if (matches.length > 1) {
    const pages = renderWithNestPage({ matches, search, pathname })
    mergeNestPage(pages)
    displayPages({ pathname, search })
  } else {
    const result = renderSinglePage({ matches, search, pathname })
    stack.push(result)
    displayPages({ key: result.key, pathname, search })
  }
}

export function replaceRoute(location: HistoryLocation, matches: InnerRouteObject[]) {
  pageHistory.popLast()
  flushPageStack()
  pushRoute(location, matches)
}

export function popRoute(location: HistoryLocation, matches: InnerRouteObject[]) {
  const { pathname, search } = location

  // 浏览器前进按钮触发 pop
  if (!pageHistory.has({ pathname, search })) {
    pushRoute(location, matches)
    return
  }

  pageHistory.pop({ pathname, search })
  const newStack = flushPageStack()

  if (newStack.length === 0) {
    pushRoute(location, matches)
  } else {
    displayPages({ pathname, search })
  }
}
