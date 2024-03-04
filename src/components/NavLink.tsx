import type {
  CSSProperties,
  ForwardedRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from 'react'
import { forwardRef } from 'react'

import useLocation from '../hooks/useLocation'
import type { LinkProps } from './Link'
import Link from './Link'

export type NavLinkRenderProps = {
  isActive: boolean
}

export interface NavLinkProps
  extends Omit<LinkProps, 'className' | 'style' | 'children'> {
  children?: ReactNode | ((props: NavLinkRenderProps) => ReactNode)
  className?: string | ((props: NavLinkRenderProps) => string | undefined)
  style?: CSSProperties | ((props: NavLinkRenderProps) => CSSProperties | undefined)
}

function NavLink(props: NavLinkProps, ref: ForwardedRef<HTMLAnchorElement>) {
  const { className: classNameProp, style: styleProp, children, to, ...rest } = props

  const location = useLocation()
  const pathname = typeof to === 'string' ? to : to.pathname
  const renderProps: NavLinkRenderProps = { isActive: location.pathname === pathname }

  let className
  if (typeof classNameProp === 'function') {
    className = classNameProp(renderProps)
  } else {
    className = [classNameProp, renderProps.isActive ? 'active' : null]
      .filter(Boolean)
      .join(' ')
  }

  const style = typeof styleProp === 'function' ? styleProp(renderProps) : styleProp

  return (
    <Link {...rest} ref={ref} to={to} className={className} style={style}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Link>
  )
}

export default forwardRef(NavLink) as ForwardRefExoticComponent<
  NavLinkProps & RefAttributes<HTMLAnchorElement>
>
