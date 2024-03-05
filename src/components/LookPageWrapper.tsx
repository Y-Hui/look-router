import type { FC } from 'react'
import { createElement, useMemo } from 'react'

import type { LookStackPage } from '../types'
import isEnableOutlet from '../utils/isEnableOutlet'
import type { LookPageCtxState } from './context'
import { LookPageCtx, LookPageVisible, OutletContext, useRouterCtx } from './context'
import LookPage from './LookPage'

export interface LookPageWrapperProps {
  data: LookStackPage
}

const LookPageWrapper: FC<LookPageWrapperProps> = (props) => {
  const { data } = props
  const { route, pathname, visible, children } = data

  const { globalWrapper } = useRouterCtx('<LookPageWrapper />').router

  const PageComponent =
    route.wrapper === null ? null : route.wrapper || globalWrapper || LookPage
  const RouteComponent = route.component

  const state = useMemo<LookPageCtxState>(() => {
    return { instance: data }
  }, [data])

  const child = isEnableOutlet(route) ? (
    <OutletContext.Provider value={children || null}>
      {/* @ts-ignore */}
      {createElement(RouteComponent)}
    </OutletContext.Provider>
  ) : (
    // @ts-ignore
    createElement(RouteComponent)
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
