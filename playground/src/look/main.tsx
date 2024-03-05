import './index.css'

import type { RouterChangeEventArgs } from 'look-router'
import { RouterView } from 'look-router'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'

import { router } from './router'

const onChange = ({ matches }: RouterChangeEventArgs) => {
  const route = matches?.at(-1)?.route
  const title = `${route?.meta?.title || ''}`
  document.title = title
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense>
      <RouterView router={router} onChange={onChange} />
    </Suspense>
  </React.StrictMode>,
)
