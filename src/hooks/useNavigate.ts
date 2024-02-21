import type { To } from 'history'
import { useCallback } from 'react'

import { useRouterCtx } from '../components/context'

export interface NavigateOpts {
  replace?: boolean
}

export function useNavigate() {
  const { router } = useRouterCtx('useNavigate')

  return useCallback(
    (to: To, opts?: NavigateOpts) => {
      const { replace = false } = opts || {}
      if (replace) {
        router.replace(to)
      } else {
        router.push(to)
      }
    },
    [router],
  )
}
