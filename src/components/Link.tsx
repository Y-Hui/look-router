import type { To } from 'history'
import type { AnchorHTMLAttributes, DetailedHTMLProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'

import { useNavigate } from '../hooks/useNavigate'
import { useRouterCtx } from './context'

type AnchorHTMLProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>
export interface LinkProps extends Omit<AnchorHTMLProps, 'href'> {
  to: To
  replace?: boolean
}

function Link(props: LinkProps, ref: ForwardedRef<HTMLAnchorElement>) {
  const { onClick, to, replace = false, children, ...rest } = props

  const { router } = useRouterCtx('<Link />')
  const navigate = useNavigate()

  return (
    <a
      {...rest}
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(to, { replace })
      }}
      href={router.createHref(to)}
    >
      {children}
    </a>
  )
}

export default forwardRef(Link)
