export function joinPaths(paths: string[]) {
  return paths.join('/').replace(/\/\/+/g, '/')
}

export function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, '').replace(/^\/*/, '/')
}
