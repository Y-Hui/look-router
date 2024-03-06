import { findLastIndex } from '../utils/findLastIndex'

export interface LookHistoryItem {
  pathname: string
  search: string
}

class LookHistory {
  /**
   * 页面访问历史记录
   * 默认情况下数组中只有一个元素，例如：
   * [[/home], [/details/tab1]]
   *
   * 当使用 switch 切换页面时，会在数组最后一项加入，例如：
   * [[/home], [/details/tab1, /details/tab2]]
   */
  value: LookHistoryItem[][] = []

  static eq(v1: LookHistoryItem, v2: LookHistoryItem) {
    return v1.pathname === v2.pathname && v1.search === v2.search
  }

  push = (history: LookHistoryItem) => {
    this.value.push([history])
  }

  switch = (history: LookHistoryItem) => {
    if (this.value.length > 0) {
      const container = this.value[this.value.length - 1]
      const index = container.findIndex((x) => LookHistory.eq(x, history))
      if (index > -1) {
        container.splice(index, 1)
      }
      container.push(history)
    } else {
      this.push(history)
    }
  }

  popLast = () => {
    const value = this.value.pop()
    return value ? value[value.length - 1] : value
  }

  /**
   * @param history 要展示的页面
   * pop 可能一次性返回多个页面，直接查找渲染目标路由，并进行切割
   */
  pop = (history: LookHistoryItem) => {
    const index = findLastIndex(this.value, (item) => {
      return (
        item.findIndex(
          (x) => x.pathname === history.pathname && x.search === history.search,
        ) > -1
      )
    })
    if (index === -1) {
      return
    }
    this.value = this.value.slice(0, index + 1)
  }

  has = (history: LookHistoryItem) => {
    return (
      this.value.findIndex((item) => {
        return item.findIndex((x) => LookHistory.eq(history, x)) > -1
      }) > -1
    )
  }

  static encode(value: LookHistoryItem) {
    return `${value.pathname}${value.search}`
  }

  get countMap() {
    const result: Record<string, { value: LookHistoryItem; count: number }> = {}
    this.value.forEach((row) => {
      row.forEach((item) => {
        const key = LookHistory.encode(item)
        let target = result[key]
        if (target === undefined) {
          // eslint-disable-next-line no-multi-assign
          target = result[key] = { value: item, count: 0 }
        }
        target.count += 1
      })
    })
    return result
  }

  get keys() {
    return Object.keys(this.countMap)
  }

  clean = () => {
    this.value = []
  }
}

export default LookHistory
