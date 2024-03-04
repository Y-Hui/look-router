import { useEffect } from 'react'

import { useLookPageCtx } from '../components/context'
import { useLatestFn } from './useLatestFn'

export default function useWatchVisibleEffect(effect: (visible: boolean) => void) {
  const { listenVisible } = useLookPageCtx('useWatchVisibleEffect')

  const effectImpl = useLatestFn(effect)
  useEffect(() => {
    return listenVisible(effectImpl)
  }, [listenVisible, effectImpl])
}
