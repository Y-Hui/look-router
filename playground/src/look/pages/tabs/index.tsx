import { NavLink, Outlet } from 'look-router'
import type { FC } from 'react'
import { createElement, Suspense } from 'react'

import HomeIcon from './icons/home.svg?react'
import HomeIconActive from './icons/home-active.svg?react'
import MessagesIcon from './icons/messages.svg?react'
import MessagesIconActive from './icons/messages-active.svg?react'
import NotificationsIcon from './icons/notifications.svg?react'
import NotificationsIconActive from './icons/notifications-active.svg?react'
import SearchIcon from './icons/search.svg?react'
import SearchIconActive from './icons/search-active.svg?react'

const tabs = [
  {
    path: '/home',
    icon: HomeIcon,
    activeIcon: HomeIconActive,
  },
  {
    path: '/search',
    icon: SearchIcon,
    activeIcon: SearchIconActive,
  },
  {
    path: '/notifications',
    icon: NotificationsIcon,
    activeIcon: NotificationsIconActive,
  },
  {
    path: '/messages',
    icon: MessagesIcon,
    activeIcon: MessagesIconActive,
  },
]

const Tabs: FC = () => {
  return (
    <>
      <Suspense>
        <Outlet />
      </Suspense>
      <nav className="fixed bottom-0 left-0 w-full h-[52px] grid grid-cols-4 border-solid border-t border-slate-200 bg-white">
        {tabs.map((item) => {
          return (
            <NavLink
              key={item.path}
              className="flex items-center justify-center text-26"
              to={item.path}
              switch
            >
              {({ isActive }) => {
                return createElement(isActive ? item.activeIcon : item.icon, {
                  className: 'svgr',
                })
              }}
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}

export default Tabs
