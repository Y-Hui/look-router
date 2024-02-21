import type { PageComponentProps } from 'look-router'
import type { FC } from 'react'

const Page: FC<PageComponentProps> = (props) => {
  const { children, visible, pathname } = props
  return (
    <div
      className="custom-page"
      data-route={pathname}
      style={{ display: visible ? undefined : 'none' }}
    >
      {children}
    </div>
  )
}

export default Page
