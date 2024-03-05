import type { To } from 'history'

import { useLookPageCtx } from '../components/context'
import { createTo } from '../utils/createTo'
import useLocation from './useLocation'

export function useHref(to: To) {
  const { instance } = useLookPageCtx('useHref')
  const location = useLocation()

  return createTo(to, location.pathname, instance.matches)
}
