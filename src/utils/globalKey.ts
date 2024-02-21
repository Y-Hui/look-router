export function createGlobalKey() {
  let globalKey = 0

  return {
    new(key?: string) {
      if (typeof key === 'string') {
        return `${key}`
      }
      // eslint-disable-next-line no-plusplus
      return `globalKey:${++globalKey}`
    },
  }
}

export const globalKey = createGlobalKey()
