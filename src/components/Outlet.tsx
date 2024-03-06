import type { FC } from 'react'

import { getIndexRoute } from '../utils/getIndexRoute'
import { useLookPageCtx, useOutletCtx } from './context'
import LookPageWrapper from './LookPageWrapper'

const Outlet: FC = () => {
  const outlet = useOutletCtx()
  const { instance } = useLookPageCtx('<Outlet />')

  if (outlet === null || outlet.length === 0) {
    const index = getIndexRoute(instance.route)
    if (index !== null) {
      return index
    }
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{outlet?.map((item) => <LookPageWrapper key={item.key} data={item} />)}</>
}

export default Outlet
