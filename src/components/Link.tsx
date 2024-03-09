import type { To } from 'history'
import type {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react'
import React, { forwardRef } from 'react'

import { useHref } from '../hooks/useHref'
import type { NavigateOpts } from '../hooks/useNavigate'
import { useNavigate } from '../hooks/useNavigate'
import { useRouterCtx } from './context'

type AnchorHTMLProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>
export interface LinkProps extends Omit<AnchorHTMLProps, 'href' | 'ref'>, NavigateOpts {
  to: To
}

function Link(props: LinkProps, ref: ForwardedRef<HTMLAnchorElement>) {
  const {
    onClick,
    to: toArg,
    replace = false,
    children,
    switch: switchMode = false,
    clean = false,
    cacheFirst,
    ...rest
  } = props

  const { router } = useRouterCtx('<Link />')
  const navigate = useNavigate()

  const to = useHref(toArg)

  return (
    <a
      {...rest}
      ref={ref}
      onClick={(e) => {
        onClick?.(e)
        e.preventDefault()
        e.stopPropagation()
        navigate(to, { replace, switch: switchMode, clean, cacheFirst })
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
