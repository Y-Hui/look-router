import type { Location } from 'history'
import type { FC, HTMLAttributes } from 'react'
import React, { useEffect, useMemo } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

import { useLatestFn } from '../hooks/useLatestFn'
import type LookRouter from '../state'
import type { MatchedRoute } from '../types'
import type { RouterViewCtxState } from './context'
import { RouterViewCtx } from './context'
import LookPageWrapper from './LookPageWrapper'

export interface RouterChangeEventArgs {
  location: Location
  matches?: MatchedRoute[]
}

export interface RouterViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  router: LookRouter
  onChange?: (e: RouterChangeEventArgs) => void
}

const RouterView: FC<RouterViewProps> = (props) => {
  const { router, onChange: onChangeImpl, children, className, style, ...rest } = props

  const routerStack = useSyncExternalStore(
    router.stack.addListener,
    router.stack.getSnapshot,
  )

  const state = useMemo<RouterViewCtxState>(() => {
    return { router }
  }, [router])

  const onChange = useLatestFn(onChangeImpl)

  useEffect(() => {
    return router.listen((location, matches) => {
      onChange?.({ location, matches })
    })
  }, [router, onChange])

  return (
    <div
      {...rest}
      className={['look-router-hosts', className].join(' ')}
      style={{ ...style, overflow: 'hidden', height: '100vh' }}
    >
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
