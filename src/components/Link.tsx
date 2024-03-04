import type { To } from 'history'
import type {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react'
import { forwardRef } from 'react'

import { useNavigate } from '../hooks/useNavigate'
import { useRouterCtx } from './context'

type AnchorHTMLProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>
export interface LinkProps extends Omit<AnchorHTMLProps, 'href' | 'ref'> {
  to: To
  replace?: boolean
  /**
   * 保留当前页面，并切换到新的页面
   * replace 与 switch 同时存在时 switch 权重更高
   */
  switch?: boolean
  /** 清空其他页面 */
  clean?: boolean
}

function Link(props: LinkProps, ref: ForwardedRef<HTMLAnchorElement>) {
  const {
    onClick,
    to,
    replace = false,
    children,
    switch: switchMode = false,
    clean = false,
    ...rest
  } = props

  const { router } = useRouterCtx('<Link />')
  const navigate = useNavigate()

  return (
    <a
      {...rest}
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(to, { replace, switch: switchMode, clean })
      }}
      href={router.instance.createHref(to)}
    >
      {children}
    </a>
  )
}

export default forwardRef(Link) as ForwardRefExoticComponent<
  LinkProps & RefAttributes<HTMLAnchorElement>
>
