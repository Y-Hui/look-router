export function findLastIndex<T>(
  arr: T[],
  callback: (item: T, index: number) => boolean,
) {
  let index = -1
  for (let i = 0; i < arr.length; i += 1) {
    if (callback(arr[i], i)) {
      index = i
    }
  }
  return index
}
