import Links from '@/Links'
import type { FC } from 'react'

const data1 = Array(10)
  .fill(null)
  .map((_, i) => i + 200)

const data = Array(100)
  .fill(null)
  .map((_, i) => i + 100)

const List: FC = () => {
  return (
    <div>
      {data1.map((item) => {
        return <h2 key={item}>{item}</h2>
      })}
      <h1>List Page</h1>
      <Links />
      <nav style={{ position: 'fixed', bottom: 0, left: 0 }}>111</nav>
      {data.map((item) => {
        return <h2 key={item}>{item}</h2>
      })}
    </div>
  )
}

export default List
