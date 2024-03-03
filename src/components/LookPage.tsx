import type { ReactElement } from 'react'
import { Suspense, useRef } from 'react'

import type { PageComponentProps } from '../types'

export interface LookPageProps extends PageComponentProps {
  noStyle?: boolean
}

function LookPage(props: LookPageProps): ReactElement {
  const { visible, pathname, children, noStyle } = props

  const node = useRef<HTMLDivElement | null>(null)

  return (
    <div
      ref={node}
      className="look-page"
      data-route={pathname}
      style={
        noStyle
          ? { display: visible ? undefined : 'none' }
          : { overflow: 'auto', height: '100vh', display: visible ? undefined : 'none' }
      }
    >
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  )
}

export default LookPage
