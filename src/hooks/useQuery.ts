import { useMemo } from 'react'

import type { Params } from '../types'
import { decodeSearch } from '../utils/search'
import useLocation from './useLocation'

/**
 * 获取当前路由下的 search 参数
 */
function useQuery(): Params
function useQuery<T extends Params>(): Record<keyof T, string | undefined | string[]>
function useQuery<T>(formatter: (searchParams: Params) => T): T
function useQuery<T>(formatter?: (searchParams: Params) => T): Params
function useQuery<T>(formatter?: (searchParams: Params) => T): Params | T {
  const location = useLocation()

  return useMemo(() => {
    if (typeof location.search !== 'string') {
      return formatter?.({}) ?? {}
    }
    const result = decodeSearch(location.search)
    return typeof formatter === 'function' ? formatter(result) : result
  }, [formatter, location.search])
}

export default useQuery
