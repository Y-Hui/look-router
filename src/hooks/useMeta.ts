import { useLookPageCtx } from '../components/context'

export default function useRoute() {
  const { instance } = useLookPageCtx('useRoute')

  return instance.route.meta
}
