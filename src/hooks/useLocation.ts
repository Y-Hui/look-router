import { useEffect, useState } from 'react'

import { useRouterCtx } from '../components/context'

export default function useLocation() {
  const { router } = useRouterCtx('useLocation')

  const [value, setValue] = useState(router.instance.location)

  useEffect(() => {
    return router.listen((e) => {
      setValue(e)
    })
  }, [router])

  return value
}
