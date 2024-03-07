import { type FC } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import AppBar from '../components/AppBar'

function decodeSearch(searchStr?: string) {
  const result: Record<string, string | string[]> = {}
  const search = new URLSearchParams(searchStr ?? '')

  // eslint-disable-next-line no-restricted-syntax
  for (const key of search.keys()) {
    const value = search.getAll(key)
    if (value.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      result[key] = value[0]
    } else {
      result[key] = value
    }
  }

  return result
}

const DetailsPage: FC = () => {
  const [search, setSearch] = useSearchParams()
  const params = useParams<{ id: string }>()

  return (
    <>
      <AppBar title="详情页" />

      {params.id === '50' && (
        <div className="mt-20 mx-18 p-10 text-orange-500 bg-orange-100 rounded-[14px] text-14">
          <p>很好！你加载了多次数据成功找到了第 50 个元素</p>
          <br />
          <p>现在思考一下：</p>
          <p>
            如果返回上一个页面，需要重新点击“加载更多”按钮才能再次找到第 50 个元素吗？
          </p>
        </div>
      )}
      <div className="mt-20 mx-18 p-10 border border-slate-200 rounded-[14px]">
        <p>Path Params</p>
        <pre className="my-10 p-10 bg-[#3f3f3f] text-white rounded-[12px]">
          <code>{JSON.stringify(params, null, 2)}</code>
        </pre>
      </div>

      <div className="mt-20 mx-18 p-10 border border-slate-200 rounded-[14px]">
        <p>URL Search</p>
        <pre className="my-10 p-10 bg-black text-white rounded-[12px]">
          <code>{JSON.stringify(decodeSearch(search.toString()), null, 2)}</code>
        </pre>
        <button
          className="block w-full h-44 bg-blue-100 text-blue-500 font-bold rounded-[12px] outline-none"
          type="button"
          onClick={() => {
            setSearch({ orderBy: 'dsc', keyword: 'foo', now: Date.now().toString() })
          }}
        >
          Update URL Search
        </button>
      </div>
      <Link className="block py-10 text-blue-500 underline text-center" to="/nest/12">
        /nest/12
      </Link>
    </>
  )
}

export default DetailsPage
