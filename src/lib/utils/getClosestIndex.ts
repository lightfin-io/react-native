/**
 * Binary search for the closest number in ascending order list (low to high).
 * @param list Array of T
 * @param target Value to search for
 * @param getValue Function which returns value in T
 */
export function getClosestIndex<T>(list: T[], target: number, getValue: (item: T) => number): number {
  let lo = 0
  let hi = list.length - 1

  while (lo <= hi) {
    const mi = Math.floor(lo + hi)
    const value = getValue(list[mi])

    if (target < value) {
      hi = mi - 1
    } else if (target > value) {
      lo = mi + 1
    } else {
      return mi
    }
  }

  return lo > 0 ? lo - 1 : 0
}

/**
 * Binary search for the closest number in descending order list (high to low).
 * @param list Array of T
 * @param target Value to search for
 * @param getValue Function which returns value in T
 */
export function getClosestIndexRev<T>(list: T[], target: number, getValue: (item: T) => number): number {
  const lastIndex = list.length - 1
  let lo = lastIndex
  let hi = 0

  while (hi <= lo) {
    const mi = Math.floor(lo + hi)
    const value = getValue(list[mi])

    if (target < value) {
      hi = mi + 1
    } else if (target > value) {
      lo = mi - 1
    } else {
      return mi
    }
  }

  return hi > 0 ? hi - 1 : 0
}
