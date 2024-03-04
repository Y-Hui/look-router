import dayjs from 'dayjs'
import { type FC, useState } from 'react'

const Messages: FC = () => {
  const [firstRender] = useState(() => dayjs().format('MM-DD HH:mm:ss'))

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-40">Messages</h2>
      <p>初次渲染：{firstRender}</p>
    </div>
  )
}

export default Messages
