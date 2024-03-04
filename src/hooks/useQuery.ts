import { useMemo } from 'react'

import { useLookPageCtx } from '../components/context'
import type { Params } from '../types'
import { decodeSearch } from '../utils/search'

/**
 * 获取当前路由下的 search 参数
 */
function useQuery(): Params
function useQuery<T extends Params>(): Record<keyof T, string | undefined | string[]>
function useQuery<T>(formatter: (searchParams: Params) => T): T
function useQuery<T>(formatter?: (searchParams: Params) => T): Params
function useQuery<T>(formatter?: (searchParams: Params) => T): Params | T {
  const { instance } = useLookPageCtx('useQuery')

  return useMemo(() => {
    if (typeof instance.search !== 'string') {
      return formatter?.({}) ?? {}
    }
    const result = decodeSearch(instance.search)
    return typeof formatter === 'function' ? formatter(result) : result
  }, [formatter, instance.search])
}

export default useQuery
