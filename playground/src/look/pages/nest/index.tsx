import clsx from 'clsx'
import { NavLink, Outlet, useLocation, useParams } from 'look-router'
import type { FC } from 'react'
import { Suspense } from 'react'

import AppBar from '@/look/components/AppBar'

const NestPage: FC = () => {
  const params = useParams<{ id: string }>()
  const location = useLocation()
  // console.log(location)

  const id = 12
  // console.log(params)
  // console.log(`/nest/${id}/comments`, id)

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
          to={`/nest/${id}/details`}
          switch
        >
          详情
        </NavLink>
        <NavLink
          className={({ isActive }) => clsx({ 'text-blue-500': isActive })}
          to={`/nest/${id}/comments`}
          switch
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
