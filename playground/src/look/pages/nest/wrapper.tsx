import clsx from 'clsx'
import type { WrapperProps as RawWrapperProps } from 'look-router'
import { useWatchVisible } from 'look-router'
import type { CSSProperties, FC } from 'react'

export interface WrapperProps extends RawWrapperProps {
  className?: string
  style?: CSSProperties
}

const Wrapper: FC<WrapperProps> = (props) => {
  const { className, style, children } = props
  const visible = useWatchVisible()

  return (
    <div
      style={!visible ? { display: 'none' } : style}
      className={clsx(className, 'bg-slate-50')}
    >
      {children}
    </div>
  )
}

export default Wrapper
