import type { SetStateAction } from 'react'
import { useCallback } from 'react'

import { useLookPageCtx, useRouterCtx } from '../components/context'
import type { SearchParams } from '../types'
import { decodeSearch, encodeSearch } from '../utils/search'

export type SetQueryFn = (action: SetStateAction<SearchParams>) => void

function useSetQuery(): SetQueryFn {
  const { instance } = useLookPageCtx('useSetQuery')
  const { router } = useRouterCtx('useSetQuery')

  return useCallback(
    (action: SetStateAction<SearchParams>) => {
      const rawSearch = decodeSearch(instance.search)
      const search = typeof action === 'function' ? action(rawSearch) : action
      router.updateSearch(instance.pathname, instance.key, encodeSearch(search))
    },
    [instance.key, instance.pathname, instance.search, router],
  )
}

export default useSetQuery
