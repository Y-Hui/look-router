import { findLastIndex } from '../utils/findLastIndex'

export interface LookHistoryItem {
  pathname: string
  search: string
}

class LookHistory {
  value: LookHistoryItem[]

  constructor() {
    this.value = []
  }

  static eq(v1: LookHistoryItem, v2: LookHistoryItem) {
    return v1.pathname === v2.pathname && v1.search === v2.search
  }

  push = (history: LookHistoryItem) => {
    this.value.push(history)
  }

  popLast = () => {
    return this.value.pop()
  }

  /**
   * @param history 要展示的页面
   * pop 可能一次性返回多个页面，直接查找渲染目标路由，并进行切割
   */
  pop = (history: LookHistoryItem) => {
    const index = findLastIndex(this.value, (x) => {
      return x.pathname === history.pathname && x.search === history.search
    })
    if (index === -1) {
      return
    }
    // 数组最后连续几个页面都是同一个路由时
    if (this.value.length === index + 1) {
      this.popLast()
    } else {
      this.value = this.value.slice(0, index + 1)
    }
  }

  has = (history: LookHistoryItem) => {
    return this.value.findIndex((x) => LookHistory.eq(history, x)) > -1
  }

  static encode(value: LookHistoryItem) {
    return `${value.pathname}${value.search}`
  }

  get countMap() {
    const result: Record<string, { value: LookHistoryItem; count: number }> = {}
    this.value.forEach((item) => {
      const key = LookHistory.encode(item)
      let target = result[key]
      if (target === undefined) {
        // eslint-disable-next-line no-multi-assign
        target = result[key] = { value: item, count: 0 }
      }
      target.count += 1
    })
    return result
  }

  clean = () => {
    this.value = []
  }
}

export default LookHistory
