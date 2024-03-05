import clsx from 'clsx'
import type { FC } from 'react'
import { Suspense } from 'react'
import { Navigate, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'

import AppBar from '@/normal/components/AppBar'

const NestPage: FC = () => {
  const params = useParams<{ id: string }>()
  const { id } = params
  console.log(params)

  const location = useLocation()
  console.log(location)

  if (location.pathname === `/nest/${id}`) {
    return <Navigate to={`/nest/${id}/details`} replace />
  }

  return (
    <>
      <AppBar title="Nest" />
      <div className="pt-10 px-18">
        <img
          className="mb-20 rounded-[12px]"
          src="https://t7.baidu.com/it/u=3631608752,3069876728&fm=193&f=GIF"
          alt=""
        />
      </div>
      <nav className="px-18 grid grid-cols-2">
        <NavLink
          className={({ isActive }) => clsx({ 'text-blue-500': isActive })}
          to="details"
          replace
        >
          详情
        </NavLink>
        <NavLink
          className={({ isActive }) => clsx({ 'text-blue-500': isActive })}
          to="comments"
          replace
        >
          评论
        </NavLink>
      </nav>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  )
}

export default NestPage
