export function joinPaths(paths: string[]) {
  return paths.join('/').replace(/\/\/+/g, '/')
}

export function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, '').replace(/^\/*/, '/')
}

export function normalizeSearch(search: string): string {
  // eslint-disable-next-line no-nested-ternary
  return !search || search === '?' ? '' : search.startsWith('?') ? search : `?${search}`
}

export function normalizeHash(hash: string): string {
  // eslint-disable-next-line no-nested-ternary
  return !hash || hash === '#' ? '' : hash.startsWith('#') ? hash : `#${hash}`
}
