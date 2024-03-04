import { type FC, useState } from 'react'
import { Link } from 'react-router-dom'

const Home: FC = () => {
  const [data, setData] = useState(() => {
    return Array(15)
      .fill(null)
      .map((_, index) => ({ key: index + 1 }))
  })

  return (
    <div className="pt-20 px-18 pb-80">
      <p className="flex items-center p-10 h-[50px] text-orange-500 bg-orange-100 rounded-[14px]">
        找到第 50 个元素并点击
      </p>
      <div className="pt-20 space-y-20">
        {data.map((item) => {
          return (
            <Link
              key={item.key}
              className="flex items-center box-border p-10 h-[80px] border border-slate-200 rounded-[14px]"
              to={`/details/${item.key}`}
            >
              List Item: {item.key}
            </Link>
          )
        })}
      </div>
      <button
        className="mt-30 mx-auto block w-[140px] h-44 border border-slate-200 font-bold rounded-[12px] outline-none"
        onClick={async () => {
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 300)
          })
          setData((prevState) => {
            return [
              ...prevState,
              ...Array(15)
                .fill(null)
                .map((_, index) => {
                  return { key: prevState.length + 1 + index }
                }),
            ]
          })
        }}
      >
        加载更多
      </button>
    </div>
  )
}

export default Home
