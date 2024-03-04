import { Link, useNavigate } from 'look-router'
import type { FC } from 'react'

const NotFound: FC = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-40 mb-50">404</h2>
      <div className="space-x-20">
        <a
          className="text-blue-500 text-16"
          href="###"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            navigate(-1)
          }}
        >
          Back
        </a>
        <Link className="text-blue-500 text-16" to="/">
          Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
