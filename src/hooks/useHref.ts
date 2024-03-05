import type { To } from 'history'

import { useLookPageCtx } from '../components/context'
import { createTo } from '../utils/createTo'

export function useHref(to: To) {
  const { instance } = useLookPageCtx('useHref')

  return createTo(to, instance.matches)
}
