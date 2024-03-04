import type { Transition } from 'history'
import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'

import { useLatestFn } from '../hooks/useLatestFn'
import { useRouterCtx } from './context'

export interface WillPopProps {
  children: ReactNode
  onWillPop: (unblock: () => void, tx: Transition) => void
}

const WillPop: FC<WillPopProps> = (props) => {
  const { children, onWillPop } = props

  const { router } = useRouterCtx('<WillPop />')

  const onWillPopHandle = useLatestFn(onWillPop)
  useEffect(() => {
    const unblock = router.block((tx) => {
      onWillPopHandle(unblock, tx)
    })
    return unblock
  }, [router, onWillPopHandle])

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export default WillPop
