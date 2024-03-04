import type { History as HistoryImpl, Location, To, Update } from 'history'
import { createBrowserHistory, createHashHistory } from 'history'

import type { InternalRouteObject, LookStackPage, RouteObject } from '../types'
import { decodePath } from '../utils/decodePath'
import { flattenRoutes } from '../utils/flattenRoutes'
import type { LookHistoryItem } from './history'
import LookHistory from './history'
import { getMatches } from './matches'
import { renderSinglePage, renderWithNestPage } from './render'
import LookStack from './stack'

export const enum Action {
  Pop = 'POP',
  Push = 'PUSH',
  Replace = 'REPLACE',
  Switch = 'SWITCH',
}

function createState<T>(initialValue: T) {
  const scope = { current: initialValue }
  return {
    getState() {
      return scope.current
    },
    setState(value: T) {
      scope.current = value
    },
    reset() {
      scope.current = initialValue
    },
  }
}

export default class LookRouter {
  instance: HistoryImpl

  history = new LookHistory()

  stack = new LookStack()

  flattenRoutes: InternalRouteObject[]

  routes: RouteObject[]

  constructor(args: { mode?: 'hash' | 'history'; routes: RouteObject[] }) {
    const { mode = 'hash', routes } = args
    this.instance = mode === 'history' ? createBrowserHistory() : createHashHistory()
    this.routes = routes
    this.flattenRoutes = flattenRoutes(routes)
    this.init()
  }

  private action = createState(Action.Pop)

  private init = () => {
    this.instance.listen((e) => {
      this.listener.forEach((fn) => {
        this.dispatchListener(e.location, fn)
      })
      this.listenImpl(e)
    })
    this.replace(this.instance.location, this.instance.location.state)
  }

  clean = () => {
    this.stack.setStack([])
    this.history.clean()
  }

  push = (to: To, state?: unknown) => {
    this.action.setState(Action.Push)
    this.instance.push(to, state)
  }

  replace = (to: To, state?: unknown) => {
    this.action.setState(Action.Replace)
    this.instance.replace(to, state)
  }

  back = (delta?: number) => {
    if (typeof delta === 'number') {
      if (delta < 1 || Number.isNaN(delta)) {
        // eslint-disable-next-line no-console
        console.error(`back(${delta}) 参数不能小与 1`)
        return
      }
    }
    this.action.setState(Action.Pop)
    this.instance.back()
  }

  switch = (to: To, state?: unknown) => {
    this.action.setState(Action.Switch)
    this.instance.replace(to, state)
  }

  private listenImpl = (e: Update) => {
    const { location } = e
    const currentAction = this.action.getState()
    const pathname = decodePath(location.pathname)
    const matches = getMatches(pathname, this.flattenRoutes)

    this.action.reset()

    if (matches.length === 0) {
      throw Error(`${pathname} does not exist`)
    }

    const matched = matches[matches.length - 1]
    if (matched.raw.redirectTo) {
      const { redirectTo } = matched.raw
      return this.replace(
        typeof redirectTo === 'function' ? redirectTo(location) : redirectTo,
      )
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
  }

  private dispatchListener = (
    location: Location,
    listener: (location: Location, route: RouteObject) => void,
  ) => {
    const matches = getMatches(location.pathname, this.flattenRoutes)
    listener?.(location, matches[matches.length - 1]!.raw!)
  }

  private listener = new Set<(location: Location, route: RouteObject) => void>()

  listen = (listener: (location: Location, route: RouteObject) => void) => {
    this.listener.add(listener)
    return () => {
      this.listener.delete(listener)
    }
  }

  private static renderRoute = (
    location: Location,
    matches: InternalRouteObject[],
  ): LookStackPage[] => {
    const { pathname, search } = location
    if (matches.length > 1) {
      return renderWithNestPage({ matches, search, pathname })
    }
    const result = renderSinglePage({ matches, search, pathname })
    return [result]
  }

  private routerPush = (location: Location, matches: InternalRouteObject[]) => {
    const { pathname, search } = location
    const args = { pathname, search }

    if (!Array.isArray(matches) || matches?.length === 0) {
      throw Error('[look-router]: Route does not exist')
    }

    this.history.push(args)

    // 跳转新页面时发现页面已存在
    if (this.stack.has(args)) {
      this.stack.visible(args)
    }

    const pages = LookRouter.renderRoute(location, matches)
    this.stack.setStack(this.diff(this.stack.stack, pages))
    this.stack.visible(args)
  }

  private routerReplace = (location: Location, matches: InternalRouteObject[]) => {
    // 此参数为要展示的页面
    const { pathname, search } = location
    const args = { pathname, search }

    this.history.popLast()
    this.history.push(args)
    const pages = LookRouter.renderRoute(location, matches)
    const newStack = this.diff(this.stack.stack, pages)
    this.stack.setStack(newStack)
    this.stack.visible(args)
  }

  private routerPop = (location: Location, matches: InternalRouteObject[]) => {
    // 此参数为要展示的页面
    const { pathname, search } = location

    // pop 时发现没有页面（浏览器前进、后退按钮）
    if (!this.history.has({ pathname, search })) {
      this.routerReplace(location, matches)
      return
    }

    this.history.pop({ pathname, search })
    const pages = LookRouter.renderRoute(location, matches)
    const newStack = this.diff(this.stack.stack, pages)
    this.stack.setStack(newStack)
    this.stack.visible({ pathname, search })
  }

  private routerSwitch = (location: Location, matches: InternalRouteObject[]) => {
    // 此参数为要展示的页面
    const { pathname, search } = location
    const args = { pathname, search }

    const popped = this.history.popLast()
    this.history.push(args)

    const pages = LookRouter.renderRoute(location, matches)
    const newStack = this.diff(this.stack.stack, pages, popped)
    this.stack.setStack(newStack)
    this.stack.visible(args)
  }

  static transformLookStackPageToMap(pages: LookStackPage[]) {
    const result = new Map<string, LookStackPage>()
    pages.forEach((item) => {
      const key = LookHistory.encode({
        pathname: item.pathname,
        search: item.search ?? '',
      })
      result.set(key, item)
    })
    return result
  }

  private diff = (
    oldPages: LookStackPage[],
    newPages: LookStackPage[],
    popped?: LookHistoryItem,
  ) => {
    if (oldPages.length === 0) {
      return newPages
    }
    const newPagesMap = LookRouter.transformLookStackPageToMap(newPages)

    const getChildren = (pages: LookStackPage[], parent: LookStackPage) => {
      return pages.filter((item) => item.route.parent === parent.route.path)
    }

    const result: LookStackPage[] = []

    oldPages.forEach((item) => {
      const key = LookHistory.encode({
        pathname: item.pathname,
        search: item.search ?? '',
      })
      const count = this.history.countMap[key]
      const shouldKeepAlive = popped && key === LookHistory.encode(popped)
      if (shouldKeepAlive) {
        // eslint-disable-next-line no-param-reassign
        item.keepAlive = true
      }
      if (count || newPagesMap.has(key) || item.keepAlive) {
        result.push(item)
        newPagesMap.delete(key)
      }
    })

    newPagesMap.forEach((item) => {
      result.push(item)
    })

    result.forEach((item, _i, arr) => {
      if (Array.isArray(item.route.raw.children)) {
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
