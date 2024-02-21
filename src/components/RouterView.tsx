import type { FC, ReactNode } from 'react'
import { useEffect, useMemo, useReducer } from 'react'

import { useLatestFn } from '../hooks/useLatestFn'
import stack from '../utils/pageStack'
import type { RouteObject, Router } from '../utils/routerImpl'
import { routerListener } from '../utils/routerListener'
import type { RouterViewCtxState } from './context'
import { RouterViewCtx } from './context'
import LookPageWrapper from './LookPageWrapper'

export interface RouterChangeEventArgs extends Omit<Partial<RouteObject>, 'pathname'> {
  pathname: string
}

export interface RouterViewProps {
  router: Router
  children?: ReactNode
  onChange?: (e: RouterChangeEventArgs) => number
}

const RouterView: FC<RouterViewProps> = (props) => {
  const { router, onChange: onChangeImpl, children } = props

  const state = useMemo<RouterViewCtxState>(() => {
    return { router }
  }, [router])

  // TODO:
  const onChange = useLatestFn(onChangeImpl)

  const [, forceUpdate] = useReducer((x) => !x, true)
  useEffect(() => {
    return router.listen((e) => {
      const { location, action } = e
      routerListener(location, action, router.flattenRoutes)
      forceUpdate()
    })
  }, [router])

  return (
    <div className="look-router-hosts" style={{ overflow: 'hidden', height: '100vh' }}>
      <RouterViewCtx.Provider value={state}>
        {children}
        {stack.value.map((item) => {
          return <LookPageWrapper key={item.key} data={item} />
        })}
      </RouterViewCtx.Provider>
    </div>
  )
}

export default RouterView
