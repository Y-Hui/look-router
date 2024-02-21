import { useRouterCtx } from '../components/context'

// TODO:
export function useParams<T extends object>() {
  const { router } = useRouterCtx('useParams')
  return {}
}
