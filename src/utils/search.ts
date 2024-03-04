import type { SearchParams } from '../types'

export function decodeSearch(searchStr?: string) {
  const result: Record<string, string | string[]> = {}
  const search = new URLSearchParams(searchStr ?? '')

  // eslint-disable-next-line no-restricted-syntax
  for (const key of search.keys()) {
    const value = search.getAll(key)
    if (value.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      result[key] = value[0]
    } else {
      result[key] = value
    }
  }

  return result
}

export function encodeSearch(init: SearchParams) {
  return new URLSearchParams(
    Object.keys(init).reduce(
      (memo, key) => {
        const value = init[key]
        return memo.concat(
          Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]],
        )
      },
      [] as [string, string][],
    ),
  ).toString()
}
