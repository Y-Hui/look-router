import { useState } from 'react'

import { useLookPageCtx } from '../components/context'

/**
 * 获取当前路由下的 search 参数（并非获取地址栏中的 search 参数）
 */
function useSearchParams(): Record<string, string | undefined>
function useSearchParams<T extends Record<string, string>>(): Record<
  keyof T,
  string | undefined
>
function useSearchParams<T>(formatter: (searchParams: Record<string, string>) => T): T
function useSearchParams<T>(
  formatter?: (searchParams: Record<string, string>) => T,
): Record<string, string | undefined> | T {
  const { instance } = useLookPageCtx('useSearchParams')

  const [data] = useState(() => {
    if (typeof instance.search !== 'string') {
      return formatter?.({}) ?? {}
    }

    const result: Record<string, string> = {}
    const search = new URLSearchParams(instance.search)

    // eslint-disable-next-line no-restricted-syntax
    for (const key of search.keys()) {
      const value = search.get(key)
      if (value != null) {
        result[key] = value
      }
    }

    if (typeof formatter === 'function') {
      return formatter(result)
    }

    return result
  })

  return data
}

export default useSearchParams
