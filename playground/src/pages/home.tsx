import type { FC } from 'react'

import Links from '@/Links'

const data = Array(100)
  .fill(null)
  .map((_, i) => i + 1)

const HomePage: FC = () => {
  return (
    <>
      <br />
      <br />
      <br />
      <h1>Home Page</h1>
      <Links />
      <nav style={{ position: 'fixed', bottom: 0, left: 0 }}>111</nav>
      {data.map((item) => {
        return <h2 key={item}>{item}</h2>
      })}
    </>
  )
}

export default HomePage
