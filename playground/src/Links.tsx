import { Link } from 'look-router'
import type { FC } from 'react'

import { router } from './router'

const Links: FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <a
        href="###"
        onClick={(e) => {
          e.preventDefault()
          router.back()
        }}
      >
        Back
      </a>
      <Link to="/">/tab</Link>
      <Link to="/tab/1">/tab/1</Link>
      <Link to="/tab/2">/tab/2</Link>
      <Link to="/home">Home</Link>
      <Link to="/details">Details</Link>
      <Link to="/details?id=2">Details?id=2</Link>
      <Link to="/details?id=3">Details?id=3</Link>
      {/* <Link to="/tab">Tab</Link> */}
      <Link to="/list">List</Link>
      <Link to="/list" replace>
        List(replace)
      </Link>
    </div>
  )
}

export default Links
