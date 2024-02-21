export default function forEachRight<T>(
  arr: T[] | undefined | null,
  callback: (item: T, index: number) => void,
) {
  if (!Array.isArray(arr)) return
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    callback(arr[i], i)
  }
}
