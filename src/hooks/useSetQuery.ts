import type { SetStateAction } from 'react'
import { useCallback } from 'react'

import { useLookPageCtx, useRouterCtx } from '../components/context'
import type { SearchParams } from '../types'
import { decodeSearch, encodeSearch } from '../utils/search'

export type SetQueryFn = (action: SetStateAction<SearchParams>) => void

function useSetQuery(): SetQueryFn {
  const { router } = useRouterCtx('useSetQuery')
  const { instance } = useLookPageCtx('useSetQuery')

  return useCallback(
    (action: SetStateAction<SearchParams>) => {
      const { getLocation } = router.instance
      const location = getLocation()
      const oldSearch = location.search
      const rawSearch = decodeSearch(oldSearch)
      const search = typeof action === 'function' ? action(rawSearch) : action
      router.updateSearch(
        { ...location, search: encodeSearch(search) },
        instance.routeKey,
        oldSearch,
      )
    },
    [instance.routeKey, router],
  )
}

export default useSetQuery
