import type { CompiledPathParam } from '../types'

export function compilePath(path: string) {
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
    regexpSource +=
      path === '*' || path === '/*'
        ? '(.*)$' // Already matched the initial /, just match the rest
        : '(?:\\/(.+)|\\/*)$' // Don't include the / in params["*"]
  }

  regexpSource += '\\/*$'

  const matcher = new RegExp(regexpSource, 'i')

  return { matcher, compiledParams: params }
}
