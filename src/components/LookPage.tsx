import type { CSSProperties, ForwardedRef, ReactElement } from 'react'
import React, { forwardRef } from 'react'

import type { WrapperProps } from '../types'
import { useLookPageVisible } from './context'

export interface LookPageProps extends WrapperProps {
  className?: string
  style?: CSSProperties
  noStyle?: boolean
}

function LookPage(props: LookPageProps, ref: ForwardedRef<HTMLDivElement>): ReactElement {
  const { className = '', style, pathname, children, noStyle } = props

  const visible = useLookPageVisible()

  return (
    <div
      ref={ref}
      className={`look-page ${className}`}
      data-route={pathname}
      style={{
        ...(!noStyle && {
          overflow: 'auto',
          height: '100vh',
        }),
        ...style,
        ...(!visible && { display: 'none' }),
      }}
    >
      {children}
    </div>
  )
}

export default forwardRef(LookPage)
