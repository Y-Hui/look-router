import type { To } from 'history'

import { useLookPageCtx, useRouterCtx } from '../components/context'
import { createTo } from '../utils/createTo'
import { useLatestFn } from './useLatestFn'

export interface NavigateOpts {
  replace?: boolean
  /**
   * 保留当前页面，并切换到新的页面
   * replace 与 switch 同时存在时 switch 权重更高
   */
  switch?: boolean
  state?: unknown
  /**
   * 优先使用缓存。
   * 若 path 一致则使用已缓存的页面。此参数将会忽略传入的 search
   */
  cacheFirst?: boolean
  /** 清空其他页面 */
  clean?: boolean
}

interface NavigateFunction {
  (to: To, options?: NavigateOpts): void
  (delta: number): void
}

export function useNavigate(): NavigateFunction {
  const { router } = useRouterCtx('useNavigate')
  const { instance } = useLookPageCtx('useNavigate')

  const navigate = useLatestFn((to: To | number, opts: NavigateOpts = {}) => {
    const { replace = false, state, clean, cacheFirst = false } = opts
    if (typeof to === 'number') {
      router.go(to)
      return
    }
    const nextTo = createTo(to, instance.matches)
    if (clean) {
      router.clean()
    }

    if (cacheFirst) {
      const result = router.navigateCacheFirst(nextTo)
      // result 可能会返回 null
      if (result === false) {
        navigate(to, { ...opts, cacheFirst: false })
      }
      return
    }

    if (opts?.switch) {
      router.switch(nextTo, state)
    } else if (replace) {
      router.replace(nextTo, state)
    } else {
      router.push(nextTo, state)
    }
  })

  return navigate
}
