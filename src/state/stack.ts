/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import type { PageInstance, Part } from '../types'
import { globalKey } from '../utils/globalKey'

interface QueryItem {
  key?: string
  pathname?: string
  search?: string
}

export default class LookStack {
  stack: PageInstance[]

  // 页面只渲染顶级路由，子路由在各自页面中渲染
  value: PageInstance[]

  constructor() {
    this.stack = []
    this.value = []
  }

  static create(instance: Part<Omit<PageInstance, 'key'>, 'visible'>): PageInstance {
    return {
      ...instance,
      visible: instance.visible || false,
      key: globalKey.new(),
    }
  }

  static eq(v1: QueryItem, v2: QueryItem) {
    if (v1.key !== undefined && v2.key !== undefined) {
      return v1.key === v2.key
    }
    return v1.pathname === v2.pathname && v1.search === v2.search
  }

  setStack = (value: PageInstance[]) => {
    this.stack = value
    this.value = this.stack.filter((item) => item.parent === undefined)
  }

  find = (args: QueryItem) => {
    return this.stack.find((x) => LookStack.eq(args, x))
  }

  findIndex = (
    callback: (value: PageInstance, index: number, obj: PageInstance[]) => unknown,
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

  push = (...items: PageInstance[]) => {
    this.setStack([...this.stack, ...items])
  }

  static getParents(page: PageInstance, withSelf = true): PageInstance[] {
    const result: PageInstance[] = withSelf ? [page] : []
    let { parent } = page
    while (parent !== undefined) {
      result.unshift(parent)
      parent = parent.parent
    }
    return result
  }

  /**
   * 重用路由
   * reference +1
   */
  reuse = (args: QueryItem) => {
    const route = this.find(args)!
    this.setStack(this.stack.slice())
    return route
  }

  update = (index: number, value: PageInstance) => {
    this.stack[index] = value
  }

  visible = (args: { key?: string; pathname: string; search?: string }) => {
    this.stack.forEach((item) => {
      item.visible = false
    })
    if (args !== undefined) {
      const route = this.find(args)!
      const returns = LookStack.getParents(route)
      route.keepAlive = false
      returns.forEach((item) => {
        item.visible = true
        if (item.children) {
          item.keepAlive = item.children.some((x) => x.keepAlive)
        }
      })
    }
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
