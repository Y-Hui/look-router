import { useEffect, useRef } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

import { useRouterCtx } from '../components/context'

export default function useLocation() {
  const { router } = useRouterCtx('useLocation')

  const listener = useRef<Set<() => void>>()
  useEffect(() => {
    return router.listen(() => {
      listener.current?.forEach((fn) => fn())
    })
  }, [router])

  return useSyncExternalStore(
    (fn) => {
      listener.current = listener.current || new Set()
      listener.current.add(fn)
      return () => {
        listener.current?.delete(fn)
      }
    },
    () => router.instance.location,
  )
}
