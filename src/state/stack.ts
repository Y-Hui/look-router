/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import type { LookStackPage, Part } from '../types'
import { findLastIndex } from '../utils/findLastIndex'
import { globalKey } from '../utils/globalKey'

interface QueryItem {
  routeKey?: string
  pathname?: string
  search?: string
}

export default class LookStack {
  stack: LookStackPage[]

  // 页面只渲染顶级路由，子路由在各自页面中渲染
  value: LookStackPage[]

  constructor() {
    this.stack = []
    this.value = []
  }

  static create(instance: Part<Omit<LookStackPage, 'key'>, 'visible'>): LookStackPage {
    return {
      ...instance,
      visible: instance.visible || false,
      key: globalKey.new(),
    }
  }

  static eq(v1: QueryItem, v2: QueryItem) {
    if (v1.routeKey !== undefined && v2.routeKey !== undefined) {
      return v1.routeKey === v2.routeKey
    }
    return v1.pathname === v2.pathname && v1.search === v2.search
  }

  setStack = (value: LookStackPage[]) => {
    this.stack = value
    this.value = this.stack.filter((item) => item.parent === undefined)
  }

  find = (args: QueryItem) => {
    return this.stack.find((x) => LookStack.eq(args, x))
  }

  filter = (
    predicate: (value: LookStackPage, index: number, array: LookStackPage[]) => boolean,
  ) => {
    return this.stack.filter(predicate)
  }

  findLastBy = (
    predicate: (item: LookStackPage, index: number) => boolean,
  ): LookStackPage | undefined => {
    const index = findLastIndex(this.stack, predicate)
    return this.stack[index]
  }

  findIndex = (
    callback: (value: LookStackPage, index: number, obj: LookStackPage[]) => unknown,
  ) => {
    return this.stack.findIndex(callback)
  }

  has = (args: QueryItem) => {
    return this.stack.findIndex((x) => LookStack.eq(args, x)) > -1
  }

  at = (index: number) => {
    if (index >= -this.stack.length && index < this.stack.length) {
      if (index >= 0) {
        return this.stack[index]
      }
      return this.stack[this.stack.length + index]
    }
    return undefined
  }

  push = (...items: LookStackPage[]) => {
    this.setStack([...this.stack, ...items])
  }

  static getParents(page: LookStackPage, withSelf = true): LookStackPage[] {
    const result: LookStackPage[] = withSelf ? [page] : []
    let { parent } = page
    while (parent !== undefined) {
      result.unshift(parent)
      parent = parent.parent
    }
    return result
  }

  update = (index: number, value: LookStackPage) => {
    this.stack[index] = value
  }

  visible = (args: { routeKey: string; pathname: string; search?: string }) => {
    this.stack.forEach((item) => {
      item.visible = false
    })
    if (args !== undefined) {
      const index = findLastIndex(this.stack, (x) => LookStack.eq(args, x))
      const route = this.stack[index]
      if (!route) {
        throw Error(`${args.pathname} does not exist`)
      }
      const returns = LookStack.getParents(route)
      returns.forEach((item) => {
        item.visible = true
      })
    }
    this.notifyListener()
  }

  visibleWith = (page: LookStackPage) => {
    this.stack.forEach((item) => {
      item.visible = false
    })
    const returns = LookStack.getParents(page)
    returns.forEach((item) => {
      item.visible = true
    })
    // 修改 visible 后 this.stack 依然是同一个内存地址，导致 useSyncExternalStore 不触发更新
    // 所以返回一个新对象，以便正确渲染
    // 场景：设置 cacheFirst 并使用 switch 模式切换 TabBar（路由需要search）
    this.setStack([...this.stack])
    this.notifyListener()
  }

  private listeners = new Set<() => void>()

  addListener = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = () => {
    return this.value
  }

  notifyListener = () => {
    this.listeners.forEach((fn) => fn())
  }
}
