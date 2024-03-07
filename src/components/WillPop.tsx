import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'

import { useLatestFn } from '../hooks/useLatestFn'
import type { Blocker } from '../types'
import { useLookPageVisible, useRouterCtx } from './context'

export interface WillPopProps {
  children: ReactNode
  onWillPop: Blocker
}

const WillPop: FC<WillPopProps> = (props) => {
  const { children, onWillPop } = props

  const { router } = useRouterCtx('<WillPop />')

  const onWillPopHandle = useLatestFn(onWillPop)
  const visible = useLookPageVisible()
  useEffect(() => {
    if (!visible) return
    return router.block(onWillPopHandle)
  }, [onWillPopHandle, router, visible])

  return children || null
}

export default WillPop
