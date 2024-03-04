import { useState } from 'react'

import useWatchVisibleEffect from './useWatchVisibleEffect'

export default function useWatchVisible() {
  const [visible, setVisible] = useState(true)
  useWatchVisibleEffect(setVisible)
  return visible
}
