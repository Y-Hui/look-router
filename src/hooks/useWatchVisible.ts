import { useEffect } from 'react'

import { useLookPageCtx } from '../components/context'
import { useLatestFn } from './useLatestFn'

export function useWatchVisible(effect: (visible: boolean) => void) {
  const { listenVisible } = useLookPageCtx('useWatchVisible')

  const effectImpl = useLatestFn(effect)
  useEffect(() => {
    return listenVisible(effectImpl)
  }, [listenVisible, effectImpl])
}
