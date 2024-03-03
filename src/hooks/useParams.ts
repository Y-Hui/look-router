import { useState } from 'react'

import { useLookPageCtx } from '../components/context'
import type { Params } from '../types'

/**
 * 获取当前路由的参数
 */
function useParams(): Params
function useParams<T extends Params>(): {
  readonly [key in keyof T]: string | undefined
}
function useParams<T>(formatter: (params: Params) => T): T
function useParams<T>(formatter?: (params: Params) => T): Params | T {
  const { instance } = useLookPageCtx('useParams')

  const [data] = useState(() => {
    const { params = {} } = instance
    return formatter ? formatter?.(params) : params
  })
  return data
}

export default useParams
