import type { SetStateAction } from 'react'
import { useCallback } from 'react'

import { useRouterCtx } from '../components/context'
import type { SearchParams } from '../types'
import { decodeSearch, encodeSearch } from '../utils/search'
import useLocation from './useLocation'

export type SetQueryFn = (action: SetStateAction<SearchParams>) => void

function useSetQuery(): SetQueryFn {
  const location = useLocation()
  const { router } = useRouterCtx('useSetQuery')

  return useCallback(
    (action: SetStateAction<SearchParams>) => {
      const oldSearch = location.search
      const rawSearch = decodeSearch(oldSearch)
      const search = typeof action === 'function' ? action(rawSearch) : action
      router.updateSearch({ ...location, search: encodeSearch(search) }, oldSearch)
    },
    [location, router],
  )
}

export default useSetQuery
