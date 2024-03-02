/* eslint-disable no-param-reassign */
import type { History as HistoryImpl, Location, To, Update } from 'history'
import { Action as HistoryAction, createBrowserHistory, createHashHistory } from 'history'

import type { PageInstance } from '../types'
import { flattenRoutes } from '../utils/flattenRoutes'
import type { InnerRouteObject, RouteObject } from '../utils/routerImpl'
import type { LookHistoryItem } from './history'
import LookHistory from './history'
import { renderSinglePage, renderWithNestPage } from './render'
import LookStack from './stack'

export enum Action {
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

export default class LookRouter {
  instance: HistoryImpl

  history = new LookHistory()

  stack = new LookStack()

  flattenRoutes: InnerRouteObject[]

  routes: RouteObject[]

  constructor(args: { mode?: 'hash' | 'history'; routes: RouteObject[] }) {
    const { mode = 'hash', routes } = args
    this.instance = mode === 'history' ? createBrowserHistory() : createHashHistory()
    this.routes = routes
    this.flattenRoutes = flattenRoutes(routes)
    this.init()
  }

  private action = createState(Action.Pop)

  private initTriggerListener = false

  private init = () => {
    this.initTriggerListener = true
    this.action.setState(Action.Replace)
    this.listenImpl({ action: HistoryAction.Replace, location: this.instance.location })
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
    const { pathname } = location
    const currentAction = this.action.getState()
    const matches = getMatches(pathname, this.flattenRoutes)

    this.action.reset()

    if (matches.length === 0) {
      throw Error(`${pathname} does not exist`)
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

  listen = (listener: (location: Location, route: RouteObject) => void) => {
    if (this.initTriggerListener) {
      this.initTriggerListener = false
      this.dispatchListener(this.instance.location, listener)
    }
    return this.instance.listen((e) => {
      this.dispatchListener(e.location, listener)
      this.listenImpl(e)
    })
  }

  private static renderRoute = (
    location: Location,
    matches: InnerRouteObject[],
  ): PageInstance[] => {
    const { pathname, search } = location
    if (matches.length > 1) {
      return renderWithNestPage({ matches, search, pathname })
    }
    const result = renderSinglePage({ matches, search, pathname })
    return [result]
  }

  private routerPush = (location: Location, matches: InnerRouteObject[]) => {
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

  private routerReplace = (location: Location, matches: InnerRouteObject[]) => {
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

  private routerPop = (location: Location, matches: InnerRouteObject[]) => {
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

  private routerSwitch = (location: Location, matches: InnerRouteObject[]) => {
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

  static transformPageInstanceToMap(pages: PageInstance[]) {
    const result = new Map<string, PageInstance>()
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
    oldPages: PageInstance[],
    newPages: PageInstance[],
    popped?: LookHistoryItem,
  ) => {
    if (oldPages.length === 0) {
      return newPages
    }
    const newPagesMap = LookRouter.transformPageInstanceToMap(newPages)

    const getChildren = (pages: PageInstance[], parent: PageInstance) => {
      return pages.filter((item) => item.route.parent === parent.route.path)
    }

    const result: PageInstance[] = []

    oldPages.forEach((item) => {
      const key = LookHistory.encode({
        pathname: item.pathname,
        search: item.search ?? '',
      })
      const count = this.history.countMap[key]
      const shouldKeepAlive = popped && key === LookHistory.encode(popped)
      if (shouldKeepAlive) {
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
      if (Array.isArray(item.route.children)) {
        item.children = getChildren(arr, item)
        item.children.forEach((child) => {
          child.parent = item
        })
        return item
      }
      return item
    })

    return result
  }
}
