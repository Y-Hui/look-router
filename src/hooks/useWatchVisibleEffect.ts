import { useEffect } from 'react'

import { useLookPageVisible } from '../components/context'
import { useLatestFn } from './useLatestFn'

export default function useWatchVisibleEffect(effect: (visible: boolean) => void) {
  const visible = useLookPageVisible()

  const effectImpl = useLatestFn(effect)
  useEffect(() => {
    return effectImpl(visible)
  }, [visible, effectImpl])
}
