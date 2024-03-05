import type { CompiledPathParam } from '../types'

export function compilePath(path: string, end = false) {
  const params: CompiledPathParam[] = []
  let regexpSource = `^${path
    .replace(/\/*\*?$/, '') // Ignore trailing / and /*, we'll handle it below
    .replace(/^\/*/, '/') // Make sure it has a leading /
    .replace(/[\\.*+^${}|()[\]]/g, '\\$&') // Escape special regex chars
    .replace(/\/:([\w-]+)(\?)?/g, (_: string, paramName: string, isOptional) => {
      params.push({ paramName, isOptional: isOptional != null })
      return isOptional ? '/?([^\\/]+)?' : '/([^\\/]+)'
    })}`

  if (path.endsWith('*')) {
    params.push({ paramName: '*' })
    regexpSource += path === '*' || path === '/*' ? '(.*)$' : '(?:\\/(.+)|\\/*)$'
  } else if (end) {
    // When matching to the end, ignore trailing slashes
    regexpSource += '\\/*$'
  } else if (path !== '' && path !== '/') {
    regexpSource += '(?:(?=\\/|$))'
  } else {
    // Nothing to match for "" or "/"
  }

  const matcher = new RegExp(regexpSource, 'i')

  return { matcher, compiledParams: params }
}
