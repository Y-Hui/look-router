/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import type { LookStackPage, Part } from '../types'
import { globalKey } from '../utils/globalKey'

interface QueryItem {
  key?: string
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
    if (v1.key !== undefined && v2.key !== undefined) {
      return v1.key === v2.key
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

  visible = (args: { key?: string; pathname: string; search?: string }) => {
    this.stack.forEach((item) => {
      item.visible = false
    })
    if (args !== undefined) {
      const route = this.find(args)
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
