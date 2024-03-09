import type { To } from 'history'
import { useEffect } from 'react'

import type { NavigateOpts } from '../hooks/useNavigate'
import { useNavigate } from '../hooks/useNavigate'

export interface NavigateProps extends NavigateOpts {
  to: To | number
}

function Navigate(props: NavigateProps) {
  const { to, replace, state, switch: switchMode, clean, cacheFirst } = props

  const navigate = useNavigate()
  useEffect(() => {
    if (typeof to === 'number') {
      return navigate(to)
    }
    return navigate(to, { replace, state, switch: switchMode, clean, cacheFirst })
  }, [clean, navigate, replace, state, switchMode, to, cacheFirst])

  return null
}

export default Navigate
