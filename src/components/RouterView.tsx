import type { FC, ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

import { useLatestFn } from '../hooks/useLatestFn'
import type LookRouter from '../state'
import type { RouteObject } from '../utils/routerImpl'
import type { RouterViewCtxState } from './context'
import { RouterViewCtx } from './context'
import LookPageWrapper from './LookPageWrapper'

export interface RouterChangeEventArgs extends Omit<Partial<RouteObject>, 'pathname'> {
  pathname: string
}

export interface RouterViewProps {
  router: LookRouter
  children?: ReactNode
  onChange?: (e: RouterChangeEventArgs) => number
}

const RouterView: FC<RouterViewProps> = (props) => {
  const { router, onChange: onChangeImpl, children } = props

  const routerStack = useSyncExternalStore(
    router.stack.addListener,
    router.stack.getSnapshot,
  )

  const state = useMemo<RouterViewCtxState>(() => {
    return { router }
  }, [router])

  // TODO:
  const onChange = useLatestFn(onChangeImpl)

  useEffect(() => {
    return router.listen((e) => {
      // TODO:
    })
  }, [router])

  return (
    <div className="look-router-hosts" style={{ overflow: 'hidden', height: '100vh' }}>
      <RouterViewCtx.Provider value={state}>
        {children}
        {routerStack.map((item) => {
          return <LookPageWrapper key={item.key} data={item} />
        })}
      </RouterViewCtx.Provider>
    </div>
  )
}

export default RouterView
