import { getClosestIndex, getClosestIndexRev } from './getClosestIndex'

describe('getClosestIndex', () => {
  it('returns 0 for empty arrays', () => {
    expect(getClosestIndex([], 99, n => n)).toEqual(0)

    interface ComplexType {
      price: number
    }
    const emptyComplex = [] as ComplexType[]
    expect(getClosestIndex(emptyComplex, 99, o => o.price)).toEqual(0)
  })
  it('finds the closest value', () => {
    expect(getClosestIndex([1, 23, 45, 67, 94, 122], 96, n => n)).toEqual(4 /*94*/)
    expect(getClosestIndex([1, 23, 45, 67, 94, 122], 47, n => n)).toEqual(2 /*45*/)
    expect(getClosestIndex([1, 23, 45, 67, 94, 122], 207, n => n)).toEqual(5 /*122*/)
    expect(getClosestIndex([1, 23, 45, 67, 94, 122], 0, n => n)).toEqual(0 /*1*/)
  })
  it('works in reverse (e.g. for bids)', () => {
    const arr = [
      [40969, 4.02e-24, 4.02e-24],
      [40941, 8.193e-30, 4.018],
      [40888.5, 9.983e-30, 4.018],
      [40821, 1.665e-30, 4.018],
      [40794.5, 8.318e-30, 4.018],
      [40786.5, 1.9999999999999997e-9, 4.018000002],
      [40718, 9.994999999999998e-30, 4.018000002],
      [40652.5, 9.085000000000002e-30, 4.018000002],
      [40601, 3e-9, 4.018000005],
      [40542, 1.8785e-17, 4.018000005],
      [40420.5, 1.8842e-17, 4.018000005],
      [40343, 2.3e-32, 4.018000005],
      [40313, 2.4000000000000004e-32, 4.018000005],
      [40307.5, 2.3e-32, 4.018000005],
      [40299, 1.8898e-17, 4.018000005],
      [40267, 2.3e-32, 4.018000005],
      [40252, 2.3e-32, 4.018000005],
      [40196.5, 2.3e-32, 4.018000005],
      [40179.5, 2.3e-32, 4.018000005],
      [40178, 1.8955e-17, 4.018000005],
      [40171, 2.3e-32, 4.018000005],
      [40141, 2.3e-32, 4.018000005],
      [40114.5, 1.0000000000000003e-32, 4.018000005],
      [40100.5, 2.3e-32, 4.018000005],
      [40059, 4.6e-32, 4.018000005],
      [39937.5, 1.9069e-17, 4.018000005],
      [39817.5, 1.9125999999999998e-17, 4.018000005],
      [39698.5, 1.9183000000000003e-17, 4.018000005],
      [39579, 1.9240999999999998e-17, 4.018000005],
      [39460.5, 1.9299e-17, 4.018000005],
    ]

    expect(getClosestIndexRev(arr, 40790, arr => arr[0])).toEqual(4)
    // Too low (return end of array)
    expect(getClosestIndexRev(arr, 38920.55, arr => arr[0])).toEqual(arr.length - 1)
    // Too high (return index 0)
    expect(getClosestIndexRev(arr, 50000, arr => arr[0])).toEqual(0)
  })
})
