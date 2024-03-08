import type { To } from 'history'
import { useEffect } from 'react'

import { useNavigate } from '../hooks/useNavigate'

export interface NavigateProps {
  to: To | number
  replace?: boolean
  state?: unknown
  /**
   * 保留当前页面，并切换到新的页面
   * replace 与 switch 同时存在时 switch 权重更高
   */
  switch?: boolean
  /** 清空其他页面 */
  clean?: boolean
}

function Navigate(props: NavigateProps) {
  const { to, replace, state, switch: switchMode, clean } = props

  const navigate = useNavigate()
  useEffect(() => {
    if (typeof to === 'number') {
      return navigate(to)
    }
    return navigate(to, { replace, state, switch: switchMode, clean })
  }, [clean, navigate, replace, state, switchMode, to])

  return null
}

export default Navigate
