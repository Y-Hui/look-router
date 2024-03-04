import type { Params } from '../types'
import useQuery from './useQuery'
import type { SetQueryFn } from './useSetQuery'
import useSetQuery from './useSetQuery'

function useSearchParams(): [Params, SetQueryFn]
function useSearchParams<T extends Params>(): [
  Record<keyof T, string | undefined>,
  SetQueryFn,
]
function useSearchParams<T>(formatter: (searchParams: Params) => T): [T, SetQueryFn]
function useSearchParams<T>(
  formatter?: (searchParams: Params) => T,
): [Params | T, SetQueryFn] {
  const search = useQuery<T>(formatter)
  const setSearch = useSetQuery()

  return [search, setSearch] as const
}

export default useSearchParams
