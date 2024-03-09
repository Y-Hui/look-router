import { useEffect, useMemo, useRef, useState } from 'react'

import { useLookPageCtx, useRouterCtx } from '../components/context'
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
  const { router } = useRouterCtx('useQuery')
  const { instance } = useLookPageCtx('useQuery')
  const [location, setValue] = useState(router.instance.getLocation)

  const instanceRef = useRef(instance)
  instanceRef.current = instance

  useEffect(() => {
    return router.listen((e) => {
      if (!instanceRef.current.visible) {
        return
      }
      setValue(e)
    })
  }, [router])

  return useMemo(() => {
    if (typeof location.search !== 'string') {
      return formatter?.({}) ?? {}
    }
    const result = decodeSearch(location.search)
    return typeof formatter === 'function' ? formatter(result) : result
  }, [formatter, location.search])
}

export default useQuery
