import type { Location } from 'history'
import type { FC, ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

import { useLatestFn } from '../hooks/useLatestFn'
import type LookRouter from '../state'
import type { RouteObject } from '../types'
import type { RouterViewCtxState } from './context'
import { RouterViewCtx } from './context'
import LookPageWrapper from './LookPageWrapper'

export interface RouterChangeEventArgs {
  location: Location
  route: RouteObject
}

export interface RouterViewProps {
  router: LookRouter
  children?: ReactNode
  onChange?: (e: RouterChangeEventArgs) => void
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

  const onChange = useLatestFn(onChangeImpl)

  useEffect(() => {
    return router.listen((location, route) => {
      onChange?.({ location, route })
    })
  }, [router, onChange])

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
