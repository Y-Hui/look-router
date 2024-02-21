import type { FC } from 'react'

import { useOutletCtx } from './context'
import LookPageWrapper from './LookPageWrapper'

const Outlet: FC = () => {
  const outlet = useOutletCtx()
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{outlet?.map((item) => <LookPageWrapper key={item.key} data={item} />)}</>
}

export default Outlet
