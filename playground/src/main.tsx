import './index.css'

import { RouterView } from 'look-router'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { router } from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterView router={router} />
  </React.StrictMode>,
)
