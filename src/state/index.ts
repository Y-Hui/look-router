import type { Blocker, History as HistoryImpl, Location, To, Update } from 'history'
import { createBrowserHistory, createHashHistory } from 'history'
import type { ComponentType } from 'react'

import type {
  FlattenRoute,
  LookStackPage,
  MatchedRoute,
  WrapperProps,
  RouteObject,
} from '../types'
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
  UpdateSearch = 'UPDATE_SEARCH',
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

  flattenRoutes: FlattenRoute[]

  routes: RouteObject[]

  block: (blocker: Blocker) => () => void

  globalWrapper?: ComponentType<WrapperProps> | null

  constructor(args: {
    mode?: 'hash' | 'history'
    routes: RouteObject[]
    globalWrapper?: ComponentType<WrapperProps> | null
  }) {
    const { mode = 'hash', routes, globalWrapper } = args
    this.instance = mode === 'history' ? createBrowserHistory() : createHashHistory()
    this.routes = routes
    this.globalWrapper = globalWrapper

    this.block = this.instance.block
    this.flattenRoutes = flattenRoutes(routes)
    this.init()
  }

  private action = createState(Action.Pop)

  private init = () => {
    this.instance.listen((e) => {
      const matches = this.listenImpl(e)
      this.listener.forEach((fn) => {
        LookRouter.dispatchListener(e.location, fn, matches)
      })
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

  go = (delta: number) => {
    this.action.setState(Action.Pop)
    this.instance.go(delta)
  }

  switch = (to: To, state?: unknown) => {
    this.action.setState(Action.Switch)
    this.instance.replace(to, state)
  }

  updateSearch = (location: Location, oldSearch: string) => {
    const { pathname, search } = location
    const target = this.stack.find({ pathname: location.pathname, search: oldSearch })
    if (!target) {
      // eslint-disable-next-line no-console
      console.error(`Update search failed, ${pathname} route not found`)
      return
    }
    target.search = search
    const args = { pathname, search }
    this.history.popLast()
    this.history.push(args)

    this.stack.setStack(this.stack.stack.slice())
    this.stack.notifyListener()
    this.action.setState(Action.UpdateSearch)
    this.instance.replace(args)
  }

  private listenImpl = (e: Update): MatchedRoute[] | undefined => {
    const { location } = e

    const currentAction = this.action.getState()
    if (currentAction === Action.UpdateSearch) {
      this.action.reset()
      return
    }

    const matches = getMatches(location, this.flattenRoutes)

    this.action.reset()

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
      this.history.push({ pathname: location.pathname, search: location.search })
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
    return matches
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

  private static renderRoute = (matches: MatchedRoute[]): LookStackPage[] => {
    if (matches.length > 1) {
      return renderWithNestPage({ matches })
    }
    const result = renderSinglePage({ matches })
    return [result]
  }

  private routerPush = (location: Location, matches: MatchedRoute[]) => {
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

    const pages = LookRouter.renderRoute(matches)
    this.stack.setStack(this.diff(this.stack.stack, pages))
    this.stack.visible(args)
  }

  private routerReplace = (location: Location, matches: MatchedRoute[]) => {
    // 此参数为要展示的页面
    const { pathname, search } = location
    const args = { pathname, search }

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

    // pop 时发现没有页面（浏览器前进、后退按钮）
    if (!this.history.has({ pathname, search })) {
      this.routerReplace(location, matches)
      return
    }

    this.history.pop({ pathname, search })
    const pages = LookRouter.renderRoute(matches)
    const newStack = this.diff(this.stack.stack, pages)
    this.stack.setStack(newStack)
    this.stack.visible({ pathname, search })
  }

  private routerSwitch = (location: Location, matches: MatchedRoute[]) => {
    // 此参数为要展示的页面
    const { pathname, search } = location
    const args = { pathname, search }

    const popped = this.history.popLast()
    this.history.push(args)

    const pages = LookRouter.renderRoute(matches)
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
      return pages.filter((item) => item.route.parentPath === parent.route.path)
    }

    const result: LookStackPage[] = []

    const keepParentKey = new Set<string>()
    const historyKey = this.history.value.map((x) => LookHistory.encode(x))
    oldPages.forEach((x) => {
      if (!x.parent) return
      const currentKey = LookHistory.encode({
        pathname: x.pathname,
        search: x.search || '',
      })
      if (historyKey.includes(currentKey)) {
        keepParentKey.add(x.parent.key)
      }
    })

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
      if (
        count ||
        newPagesMap.has(key) ||
        item.keepAlive ||
        keepParentKey.has(item.key)
      ) {
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
