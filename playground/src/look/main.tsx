import './index.css'

import { RouterView } from 'look-router'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'

import { router } from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense>
      <RouterView router={router} />
    </Suspense>
  </React.StrictMode>,
)
