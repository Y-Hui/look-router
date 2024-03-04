import type { To } from 'history'
import { useCallback } from 'react'

import { useRouterCtx } from '../components/context'

export interface NavigateOpts {
  replace?: boolean
  /**
   * 保留当前页面，并切换到新的页面
   * replace 与 switch 同时存在时 switch 权重更高
   */
  switch?: boolean
  state?: unknown
  /** 清空其他页面 */
  clean?: boolean
}

interface NavigateFunction {
  (to: To, options?: NavigateOpts): void
  (delta: number): void
}

export function useNavigate(): NavigateFunction {
  const { router } = useRouterCtx('useNavigate')

  return useCallback(
    (to: To | number, opts: NavigateOpts = {}) => {
      const { replace = false, state, clean } = opts
      if (typeof to === 'number') {
        router.go(to)
        return
      }
      if (clean) {
        router.clean()
      }
      if (opts?.switch) {
        router.switch(to, state)
      } else if (replace) {
        router.replace(to, state)
      } else {
        router.push(to, state)
      }
    },
    [router],
  )
}
