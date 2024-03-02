import type { FC } from 'react'
import { createElement, useEffect, useMemo, useRef } from 'react'

import type { PageInstance } from '../types'
import isEnableOutlet from '../utils/isEnableOutlet'
import type { LookPageCtxState } from './context'
import { LookPageCtx, OutletContext } from './context'
import LookPage from './LookPage'

export interface LookPageWrapperProps {
  data: PageInstance
}

const LookPageWrapper: FC<LookPageWrapperProps> = (props) => {
  const { data } = props
  const { route, pathname, visible, children } = data
  const PageComponent = route.pageComponent || LookPage
  const RouteComponent = route.component

  const listeners = useRef(new Set<(visible: boolean) => void>())
  const state = useMemo<LookPageCtxState>(() => {
    return {
      instance: data,
      listenVisible(listener) {
        listeners.current.add(listener)
        return () => {
          listeners.current.delete(listener)
        }
      },
    }
  }, [data])

  useEffect(() => {
    listeners.current.forEach((fn) => fn(visible))
  }, [visible])

  return (
    <LookPageCtx.Provider value={state}>
      <PageComponent pathname={pathname} visible={visible}>
        {isEnableOutlet(route) ? (
          <OutletContext.Provider value={children || null}>
            {/* @ts-ignore */}
            {createElement(RouteComponent)}
          </OutletContext.Provider>
        ) : (
          // @ts-ignore
          createElement(RouteComponent)
        )}
      </PageComponent>
    </LookPageCtx.Provider>
  )
}

export default LookPageWrapper
