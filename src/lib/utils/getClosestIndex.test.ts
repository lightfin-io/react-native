import { getClosestIndex, getClosestIndexRev } from './getClosestIndex';

describe('getClosestIndex', () => {
  it('returns 0 for empty arrays', () => {
    expect(getClosestIndex([], 99, n => n)).toEqual(0);

    interface ComplexType {
      price: number;
    }
    const emptyComplex = [] as ComplexType[];
    expect(getClosestIndex(emptyComplex, 99, o => o.price)).toEqual(0);
  });
  it('finds the closest value', () => {
    expect(getClosestIndex([1, 23, 45, 67, 94, 122], 96, n => n)).toEqual(
      4 /* 94 */,
    );
    expect(getClosestIndex([1, 23, 45, 67, 94, 122], 47, n => n)).toEqual(
      2 /* 45 */,
    );
    expect(getClosestIndex([1, 23, 45, 67, 94, 122], 207, n => n)).toEqual(
      5 /* 122 */,
    );
    expect(getClosestIndex([1, 23, 45, 67, 94, 122], 0, n => n)).toEqual(
      0 /* 1 */,
    );
  });
  it('works in reverse (e.g. for bids)', () => {
    const arr = [
      [40969],
      [40941],
      [40888.5],
      [40821],
      [40794.5],
      [40786.5],
      [40718],
      [40652.5],
      [40601],
      [40542],
      [40420.5],
      [40343],
      [40313],
      [40307.5],
      [40299],
      [40267],
      [40252],
      [40196.5],
      [40179.5],
      [40178],
      [40171],
      [40141],
      [40114.5],
      [40100.5],
      [40059],
      [39937.5],
      [39817.5],
      [39698.5],
      [39579],
      [39460.5],
    ];

    expect(getClosestIndexRev(arr, 40790, d => d[0])).toEqual(4);
    // Too low (return end of array)
    expect(getClosestIndexRev(arr, 38920.55, d => d[0])).toEqual(
      arr.length - 1,
    );
    // Too high (return index 0)
    expect(getClosestIndexRev(arr, 50000, d => d[0])).toEqual(0);
  });
});
