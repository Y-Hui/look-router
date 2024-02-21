import { PageInstance, PageInstanceType } from '../types'

interface QueryItem {
  key?: string
  pathname?: string
  search?: string
}
interface PageRelation {
  return: PageInstance[]
  self: PageInstance
  children: PageInstance[]
}

export class PageStack {
  stack: PageInstance[]

  constructor() {
    this.stack = []
  }

  get value() {
    // 页面只渲染顶级路由，子路由在各自页面中渲染
    return this.stack.filter((item) => item.parent === undefined)
  }

  static eq(v1: QueryItem, v2: QueryItem) {
    if (v1.key !== undefined && v2.key !== undefined) {
      return v1.key === v2.key
    }
    return v1.pathname === v2.pathname && v1.search === v2.search
  }

  setStack(value: PageInstance[]) {
    this.stack = value
  }

  find(args: QueryItem) {
    return this.stack.find((x) => PageStack.eq(args, x))
  }

  findIndex(
    callback: (value: PageInstance, index: number, obj: PageInstance[]) => unknown,
  ) {
    return this.stack.findIndex(callback)
  }

  has(args: QueryItem) {
    return this.stack.findIndex((x) => PageStack.eq(args, x)) > -1
  }

  at(index: number) {
    if (index >= -this.stack.length && index < this.stack.length) {
      if (index >= 0) {
        return this.stack[index]
      }
      return this.stack[this.stack.length + index]
    }
    return undefined
  }

  update(index: number, value: PageInstance) {
    this.stack[index] = value
  }

  push(...items: PageInstance[]) {
    this.stack.push(...items)
  }

  // pop() {
  //   if (this.value.length === 0) {
  //     return
  //   }
  //   const last = this.value[this.value.length - 1]
  //   const shouldRemoveItems = [last]

  //   let { children } = last
  //   while (Array.isArray(children) && children.length > 0) {
  //     const item = children.pop()!
  //     shouldRemoveItems.push(item)
  //     children = (item?.children || []).concat(children)
  //   }

  //   this.stack = this.stack.filter((item) => {
  //     return !shouldRemoveItems.includes(item)
  //   })
  //   return last
  // }

  static getReturns(page: PageInstance, withSelf = true): PageInstance[] {
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
  reuse(args: QueryItem) {
    const route = this.find(args)!
    route.type = PageInstanceType.Route
    route.reference += 1
    return route
  }
}

const stack = new PageStack()

window.stack = stack

export default stack
