import { findLastIndex } from './findLastIndex'

interface PageHistoryItem {
  pathname: string
  search: string
}

export class PageHistory {
  value: PageHistoryItem[]

  constructor() {
    this.value = []
  }

  static eq(v1: PageHistoryItem, v2: PageHistoryItem) {
    return v1.pathname === v2.pathname && v1.search === v2.search
  }

  push(history: PageHistoryItem) {
    this.value.push(history)
  }

  popLast() {
    return this.value.pop()
  }

  /**
   * pop 可能一次性返回多个页面，直接查找渲染目标路由，并进行切割
   */
  pop(history: PageHistoryItem) {
    const index = findLastIndex(this.value, (x) => {
      return x.pathname === history.pathname && x.search === history.search
    })
    if (index === -1) {
      this.value = []
      return
    }
    // 数组最后连续几个页面都是同一个路由时
    if (this.value.length === index + 1) {
      this.popLast()
    } else {
      this.value = this.value.slice(0, index + 1)
    }
  }

  has(history: PageHistoryItem) {
    return this.value.findIndex((x) => PageHistory.eq(history, x)) > -1
  }

  static encode(value: PageHistoryItem) {
    return `${value.pathname}${value.search}`
  }

  get countMap() {
    const result: Record<string, { value: PageHistoryItem; count: number }> = {}
    this.value.forEach((item) => {
      const key = PageHistory.encode(item)
      let target = result[key]
      if (target === undefined) {
        target = result[key] = { value: item, count: 0 }
      }
      target.count += 1
    })
    return result
  }
}

const pageHistory = new PageHistory()

window.pageHistory = pageHistory
export default pageHistory
