import type { History, Location } from 'history'
import { Action as HistoryAction } from 'history'

import type { Blocker, Path } from '../types'
import { createBlock } from './block'

export const enum Action {
  Pop = 'POP',
  Push = 'PUSH',
  Replace = 'REPLACE',
  Switch = 'SWITCH',
  UpdateSearch = 'UPDATE_SEARCH',
}

export interface ProxyHistory
  extends Omit<History, 'listen' | 'block' | 'push' | 'replace'> {
  switch: (to: Path, state?: unknown) => void
  push: (to: Path, state?: unknown) => void
  replace: (to: Path, state?: unknown) => void
  setAction: (action: Action) => void
  block: (blocker: Blocker) => () => void
  listen(listener: (update: Update) => void): () => void
  updateSearch: (location: Location) => void
}

export interface Update {
  action: Action
  location: Location
  delta: null | number
}

function getIndex(): number {
  const state = window.history.state || { idx: null }
  return state.idx
}

export function proxyHistory(history: History): ProxyHistory {
  let index = getIndex()!
  if (index == null) {
    index = 0
    window.history.replaceState({ ...window.history.state, idx: index }, '')
  }

  const blockImpl = createBlock()

  let currentAction = Action.Pop

  const result: ProxyHistory = {
    ...history,
    get location() {
      return history.location
    },
    listen(listener) {
      let ignoreNextHistoryUpdate = false
      let prevLocation = history.location
      return history.listen((update) => {
        let delta: number | null = null

        if (update.action === HistoryAction.Pop) {
          const nextIndex = getIndex()
          delta = nextIndex == null ? null : nextIndex - index
          index = nextIndex

          // 浏览器前进按钮
          if (delta && delta > 0) {
            currentAction = Action.Push
          }
        }

        if (ignoreNextHistoryUpdate) {
          ignoreNextHistoryUpdate = false
          return
        }

        if (blockImpl.isBlock && delta != null) {
          ignoreNextHistoryUpdate = true
          // 浏览器前进后退发现 block 时还原路由
          history.go(delta * -1)
          const deltaVal = delta
          const shouldBlockArgs = {
            proceed: () => {
              // 解决 window.alert / window.confirm 阻塞导致 history.go 失败
              setTimeout(() => {
                history.go(deltaVal)
              })
            },
            from: prevLocation,
            to: update.location,
          }
          if (blockImpl.shouldBlock(shouldBlockArgs)) {
            return
          }
        }

        listener({ action: currentAction, location: update.location, delta })
        currentAction = Action.Pop
        prevLocation = update.location
      })
    },
    block(blocker) {
      return blockImpl.block(blocker)
    },
    go(delta) {
      currentAction = delta > 0 ? Action.Push : Action.Pop
      history.go(delta)
    },
    forward() {
      currentAction = Action.Push
      history.go(1)
    },
    back() {
      currentAction = Action.Pop
      history.go(-1)
    },
    push: (to, state) => {
      const shouldBlockArgs = {
        proceed: () => result.push(to, state),
        from: history.location,
        to,
      }
      if (blockImpl.shouldBlock(shouldBlockArgs)) {
        return
      }
      index = getIndex() + 1
      currentAction = Action.Push
      history.push(to, state)
    },
    replace: (to, state) => {
      const shouldBlockArgs = {
        proceed: () => result.replace(to, state),
        from: history.location,
        to,
      }
      if (blockImpl.shouldBlock(shouldBlockArgs)) {
        return
      }
      index = getIndex()
      currentAction = Action.Replace
      history.replace(to, state)
    },
    switch: (to, state) => {
      const shouldBlockArgs = {
        proceed: () => result.switch(to, state),
        from: history.location,
        to,
      }
      if (blockImpl.shouldBlock(shouldBlockArgs)) {
        return
      }
      index = getIndex()
      currentAction = Action.Switch
      history.replace(to, state)
    },
    setAction: (value) => {
      currentAction = value
    },
    updateSearch: (location) => {
      index = getIndex()
      currentAction = Action.UpdateSearch
      history.replace(location)
    },
  }
  return result
}
