import { useCallback, useRef } from 'react'

export function useLatestFn<T>(callback?: T | undefined): T
// eslint-disable-next-line @typescript-eslint/ban-types
export function useLatestFn<T extends Function>(callback: T) {
  const fn = useRef(callback)
  fn.current = callback

  return useCallback((...args: unknown[]) => {
    return fn.current?.(...args)
  }, []) as unknown as T
}
