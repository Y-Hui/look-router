import type { FC, ReactNode } from 'react'
import { createElement, useMemo } from 'react'

import type { LookStackPage } from '../types'
import type { LookPageCtxState } from './context'
import { LookPageCtx, LookPageVisible, OutletContext, useRouterCtx } from './context'
import LookPage from './LookPage'

export interface LookPageWrapperProps {
  data: LookStackPage
}

const LookPageWrapper: FC<LookPageWrapperProps> = (props) => {
  const { data } = props
  const { route, pathname, visible, children } = data

  const { router } = useRouterCtx('<LookPageWrapper />')
  const { globalWrapper } = router

  const PageComponent =
    route.wrapper === null ? null : route.wrapper || globalWrapper || LookPage
  const RouteComponent = route.component

  const state = useMemo<LookPageCtxState>(() => {
    return { instance: data }
  }, [data])

  const child: ReactNode = (
    <OutletContext.Provider value={children || null}>
      {/* @ts-ignore */}
      {createElement(RouteComponent)}
    </OutletContext.Provider>
  )

  return (
    <LookPageVisible.Provider value={visible}>
      <LookPageCtx.Provider value={state}>
        {PageComponent ? (
          <PageComponent pathname={pathname}>{child}</PageComponent>
        ) : (
          child
        )}
      </LookPageCtx.Provider>
    </LookPageVisible.Provider>
  )
}

export default LookPageWrapper
