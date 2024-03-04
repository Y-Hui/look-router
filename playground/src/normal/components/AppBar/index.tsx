import clsx from 'clsx'
import type { CSSProperties, FC, ReactNode } from 'react'
import { isValidElement } from 'react'
import { useNavigate } from 'react-router-dom'

import BackIcon from './arrow-left.svg?react'

export interface AppBarProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
  title?: string
  canBack?: boolean
  content?: ReactNode
  contentClassName?: string
}

const AppBar: FC<AppBarProps> = (props) => {
  const {
    className,
    style,
    children,
    canBack = true,
    title,
    content,
    contentClassName,
  } = props

  const navigate = useNavigate()

  return (
    <nav
      className={clsx(
        'box-border bg-white transition-colors sticky black top-0 left-0 w-full z-10',
        className,
      )}
      style={style}
    >
      <div
        className={clsx(
          'relative flex items-center justify-center h-44',
          contentClassName,
        )}
      >
        {isValidElement(content) ? (
          content
        ) : (
          <>
            {canBack && (
              <button
                className="absolute z-1 left-0 top-0 pl-[7px] min-w-[100px] h-full bg-transparent border-none"
                onClick={() => navigate(-1)}
                aria-label="Back"
              >
                <BackIcon className="svgr text-24" />
              </button>
            )}
            <h2 className="text-center text-[17px] font-bold">{title}</h2>
          </>
        )}
      </div>
      {children}
    </nav>
  )
}

export default AppBar
