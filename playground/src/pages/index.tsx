import { Link, Outlet } from 'look-router'
import type { FC } from 'react'

const IndexPage: FC = () => {
  return (
    <>
      <Outlet />
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 44,
          backgroundColor: '#eee',
          display: 'flex',
        }}
      >
        <Link
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
          to="/tab/1"
          // replace
        >
          tab1
        </Link>
        <Link
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
          to="/tab/2"
          // replace
        >
          tab2
        </Link>
      </nav>
    </>
  )
}

export default IndexPage
