import type { Location } from 'history'
import { createBrowserHistory, createHashHistory } from 'history'
import type { ComponentType } from 'react'

import type {
  FlattenRoute,
  LookStackPage,
  MatchedRoute,
  Path,
  RouteObject,
  WrapperProps,
} from '../types'
import { createTo } from '../utils/createTo'
import { flattenRoutes } from '../utils/flattenRoutes'
import LookHistory from './history'
import { getMatches } from './matches'
import type { ProxyHistory, Update } from './proxy-history'
import { Action, proxyHistory } from './proxy-history'
import { renderSinglePage, renderWithNestPage } from './render'
import LookStack from './stack'

export interface LookRouterArgs {
  mode?: 'hash' | 'history'
  routes: RouteObject[]
  globalWrapper?: ComponentType<WrapperProps> | null
  onBeforeEntering?: (
    to: { location: Location; route?: RouteObject },
    from?: Location,
  ) => Path | Promise<Path>
  onAfterEntering?: (
    to: { location: Location; route: RouteObject },
    from?: Location,
  ) => void
}

export default class LookRouter {
  instance: ProxyHistory

  block: ProxyHistory['block']

  push: ProxyHistory['push']

  replace: ProxyHistory['replace']

  go: ProxyHistory['go']

  switch: ProxyHistory['switch']

  history = new LookHistory()

  stack = new LookStack()

  flattenRoutes: FlattenRoute[]

  routes: RouteObject[]

  globalWrapper?: LookRouterArgs['globalWrapper']

  private from?: Location

  private updateFrom = () => {
    this.from = { ...this.instance.getLocation() }
  }

  onBeforeEntering: (location: Location, matches?: MatchedRoute[]) => Promise<Path>

  onAfterEntering: (matches: MatchedRoute[]) => void

  constructor(args: LookRouterArgs) {
    const {
      mode = 'hash',
      routes,
      globalWrapper,
      onBeforeEntering,
      onAfterEntering,
    } = args
    this.instance = proxyHistory(
      mode === 'history' ? createBrowserHistory() : createHashHistory(),
    )
    this.routes = routes
    this.globalWrapper = globalWrapper
    this.block = this.instance.block
    this.push = this.instance.push
    this.replace = this.instance.replace
    this.go = this.instance.go
    this.switch = this.instance.switch

    this.onBeforeEntering = async (location, matches) => {
      if (!onBeforeEntering) return location
      const nextTo = await Promise.resolve(
        onBeforeEntering(
          { location, route: matches?.[matches.length - 1].route },
          this.from,
        ),
      )
      return nextTo
    }

    this.onAfterEntering = (matches) => {
      onAfterEntering?.(
        {
          location: this.instance.getLocation(),
          route: matches[matches.length - 1].route,
        },
        this.from,
      )
      this.updateFrom()
    }
    this.flattenRoutes = flattenRoutes(routes)
    this.init()
  }

  static dispatchListener = (
    location: Location,
    listener: (location: Location, matches?: MatchedRoute[]) => void,
    matches?: MatchedRoute[],
  ) => {
    listener?.(location, matches)
  }

  private listener = new Set<(location: Location, matches?: MatchedRoute[]) => void>()

  listen = (listener: (location: Location, matches?: MatchedRoute[]) => void) => {
    this.listener.add(listener)
    return () => {
      this.listener.delete(listener)
    }
  }

  private init = () => {
    this.instance.listen(async (e) => {
      const matches = await this.listenImpl(e)
      if (matches !== null) {
        this.listener.forEach((fn) => {
          LookRouter.dispatchListener(e.location, fn, matches)
        })
      }
    })
    this.replace(this.instance.getLocation(), this.instance.getLocation().state)
  }

  clean = () => {
    this.stack.setStack([])
    this.history.clean()
  }

  updateSearch = (location: Location, routeKey: string, oldSearch: string) => {
    const { pathname, search } = location
    const target = this.stack.find({ pathname: location.pathname, search: oldSearch })
    if (!target) {
      if (__DEV__) {
        throw Error(`Update search failed, ${pathname} route not found`)
      } else {
        // eslint-disable-next-line no-console
        console.error(`Update search failed, ${pathname} route not found`)
      }
      return
    }
    target.search = search
    const args = { pathname, search, routeKey }
    this.history.updateSearch(args)

    this.stack.setStack(this.stack.stack.slice())
    this.instance.updateSearch(location)
  }

  navigateCacheFirst = (to: Path): boolean | null => {
    const { pathname, search } = to
    const matches = getMatches({ pathname, search: search || '' }, this.flattenRoutes)

    if (!matches) {
      if (__DEV__) {
        throw Error(`${to.pathname} does not exist`)
      } else {
        // eslint-disable-next-line no-console
        console.error(Error(`${to.pathname} does not exist`))
      }
      return null
    }

    const matched = matches[matches.length - 1]
    const cached = this.stack.filter((item) => {
      return item.pathname === matched.pathname
    })

    const isSameRoutePath = matches.every((item) => {
      return item.route.path === matched.route.path
    })
    if (isSameRoutePath) {
      // // 若 matches.routeKey 不是 cached.routeKey 的子集，放弃激活缓存页面，回退正常流程
      // const isSubSet = matches.every(({ routeKey }) => {
      //   const index = cached.findIndex((x) => x.routeKey === routeKey)
      //   return index > -1
      // })
      if (matches.length !== cached.length) {
        return false
      }
    }

    const target = this.stack.findLastBy((item) => {
      return item.pathname === matched.pathname
    })
    if (target) {
      this.history.activeLastBy((x) => x.pathname === pathname)
      this.stack.visibleWith(target)
      this.instance.onlyVisible({ pathname, search: target.search || '' })
      return true
    }
    return false
  }

  private listenImpl = async (e: Update): Promise<MatchedRoute[] | undefined | null> => {
    const { location, action: currentAction } = e

    if ([Action.UpdateSearch, Action.OnlyVisible].includes(currentAction)) {
      return
    }

    const matches = getMatches(location, this.flattenRoutes)
    const nextTo = await this.onBeforeEntering(location, matches || undefined)
    if (
      nextTo.pathname !== location.pathname ||
      (nextTo.hash || '') !== location.hash ||
      (nextTo.search || '') !== location.search
    ) {
      this.replace(nextTo, location.state)
      return null
    }

    if (!matches) {
      throw Error(`${location.pathname} does not exist`)
    }

    const matched = matches[matches.length - 1]
    if (matched.route.redirectTo) {
      const { redirectTo } = matched.route
      const to = createTo(
        typeof redirectTo === 'function' ? redirectTo(location) : redirectTo,
        matches,
      )
      this.history.push({
        pathname: location.pathname,
        search: location.search,
        routeKey: matched.routeKey,
      })
      this.replace(to)
      return
    }

    switch (currentAction) {
      case Action.Push: {
        this.routerPush(location, matches)
        break
      }
      case Action.Replace: {
        this.routerReplace(location, matches)
        break
      }
      case Action.Switch: {
        this.routerSwitch(location, matches)
        break
      }
      default: {
        this.routerPop(location, matches)
        break
      }
    }
    this.onAfterEntering(matches)
    return matches
  }

  private static renderRoute = (matches: MatchedRoute[]): LookStackPage[] => {
    if (matches.length > 1) {
      return renderWithNestPage({ matches })
    }
    const result = renderSinglePage({ matches })
    return [result]
  }

  private routerPush = (location: Location, matches: MatchedRoute[]) => {
    const { pathname, search } = location

    if (!Array.isArray(matches) || matches?.length === 0) {
      throw Error('[look-router]: Route does not exist')
    }

    const matched = matches[matches.length - 1]
    const args = { pathname, search, routeKey: matched.routeKey }
    this.history.push(args)

    // 跳转新页面时发现页面已存在
    if (this.stack.has(args)) {
      this.stack.visible(args)
    }

    const pages = LookRouter.renderRoute(matches)
    this.stack.setStack(this.diff(this.stack.stack, pages))
    this.stack.visible(args)
  }

  private routerReplace = (location: Location, matches: MatchedRoute[]) => {
    // 此参数为要展示的页面
    const { pathname, search } = location
    const matched = matches[matches.length - 1]
    const args = { pathname, search, routeKey: matched.routeKey }

    this.history.popLast()
    this.history.push(args)
    const pages = LookRouter.renderRoute(matches)
    const newStack = this.diff(this.stack.stack, pages)
    this.stack.setStack(newStack)
    this.stack.visible(args)
  }

  private routerPop = (location: Location, matches: MatchedRoute[]) => {
    // 此参数为要展示的页面
    const { pathname, search } = location
    const matched = matches[matches.length - 1]
    const args = { pathname, search, routeKey: matched.routeKey }

    // pop 时发现没有页面（浏览器前进、后退按钮）
    if (!this.history.has(args)) {
      this.routerReplace(location, matches)
      return
    }

    this.history.pop(args)
    const pages = LookRouter.renderRoute(matches)
    const newStack = this.diff(this.stack.stack, pages)
    this.stack.setStack(newStack)
    this.stack.visible(args)
  }

  private routerSwitch = (location: Location, matches: MatchedRoute[]) => {
    // 此参数为要展示的页面
    const { pathname, search } = location
    const matched = matches[matches.length - 1]
    const args = { pathname, search, routeKey: matched.routeKey }

    this.history.switch(args)

    const pages = LookRouter.renderRoute(matches)
    const newStack = this.diff(this.stack.stack, pages)
    this.stack.setStack(newStack)
    this.stack.visible(args)
  }

  static transformLookStackPageToMap(pages: LookStackPage[]) {
    const result = new Map<string, LookStackPage>()
    pages.forEach((item) => {
      const key = LookHistory.encode({
        pathname: item.pathname,
        search: item.search ?? '',
        routeKey: item.routeKey,
      })
      result.set(key, item)
    })
    return result
  }

  private diff = (oldPages: LookStackPage[], newPages: LookStackPage[]) => {
    if (oldPages.length === 0) {
      return newPages
    }
    const newPagesMap = LookRouter.transformLookStackPageToMap(newPages)

    const getChildren = (pages: LookStackPage[], parent: LookStackPage) => {
      return pages.filter((item) => item.route.parentRouteKey === parent.routeKey)
    }

    const result: LookStackPage[] = []

    const keepParentKey = new Set<string>()
    const historyKey = this.history.keys
    oldPages.forEach((x) => {
      if (!x.parent) return
      const currentKey = LookHistory.encode({
        pathname: x.pathname,
        search: x.search || '',
        routeKey: x.routeKey,
      })
      if (historyKey.includes(currentKey)) {
        keepParentKey.add(x.parent.key)
      }
    })

    oldPages.forEach((item) => {
      const key = LookHistory.encode({
        pathname: item.pathname,
        search: item.search ?? '',
        routeKey: item.routeKey,
      })
      const count = this.history.countMap[key]
      if (count || newPagesMap.has(key) || keepParentKey.has(item.key)) {
        if (item.parent) {
          keepParentKey.add(item.parent.key)
        }
        result.push(item)
        newPagesMap.delete(key)
      }
    })

    newPagesMap.forEach((item) => {
      result.push(item)
    })

    result.forEach((item, _i, arr) => {
      if (Array.isArray(item.route.children)) {
        // eslint-disable-next-line no-param-reassign
        item.children = getChildren(arr, item)
        item.children.forEach((child) => {
          // eslint-disable-next-line no-param-reassign
          child.parent = item
        })
        return item
      }
      return item
    })

    return result
  }
}
