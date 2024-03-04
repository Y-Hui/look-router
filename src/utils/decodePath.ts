export function decodePath(value: string) {
  try {
    return value
      .split('/')
      .map((v) => decodeURIComponent(v).replace(/\//g, '%2F'))
      .join('/')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      false,
      `The URL path "${value}" could not be decoded because it is is a ` +
        `malformed URL segment. This is probably due to a bad percent ` +
        `encoding (${error}).`,
    )
    return value
  }
}
