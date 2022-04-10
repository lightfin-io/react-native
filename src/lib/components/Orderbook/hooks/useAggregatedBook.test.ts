import { floorToTick, ceilToTick } from '../../../utils'
import { OBLevel } from '../../../types'
import { aggregateLevels } from './useAggregatedBook'

describe('useAggregatedBook', () => {
  it('can aggregate bids', () => {
    const levels: OBLevel[] = [
      {
        price: 1001.1,
        size: 1,
        cumSize: 1,
      },
      {
        price: 1001.0,
        size: 1,
        cumSize: 2,
      },
      {
        price: 1000.9,
        size: 1,
        cumSize: 3,
      },
      {
        price: 1000.8,
        size: 1,
        cumSize: 4,
      },
      {
        price: 1000.7,
        size: 1,
        cumSize: 5,
      },
      {
        price: 1000.6,
        size: 1,
        cumSize: 6,
      },
      {
        price: 1000.5,
        size: 1,
        cumSize: 7,
      },
      {
        price: 1000.4,
        size: 1,
        cumSize: 8,
      },
      {
        price: 1000.3,
        size: 1,
        cumSize: 9,
      },
      {
        price: 1000.2,
        size: 1,
        cumSize: 10,
      },
      {
        price: 1000.1,
        size: 1,
        cumSize: 11,
      },
      {
        price: 1000.0,
        size: 2,
        cumSize: 13,
      },
    ]

    // tickSize: baseTickSize
    // No change (base tick size)
    // Note: It's better to just not call the fn.
    const aggregated1 = aggregateLevels(levels, 999, 0.1, floorToTick)

    expect(aggregated1).toEqual({
      aggregatedLevels: levels,
      maxSize: 2,
    })

    // tickSize: 0.5
    const aggregated2 = aggregateLevels(levels, 999, 0.5, floorToTick)

    expect(aggregated2).toEqual({
      aggregatedLevels: [
        { price: 1001, size: 2, cumSize: 2 },
        { price: 1000.5, size: 5, cumSize: 7 },
        { price: 1000, size: 6, cumSize: 13 },
      ],
      maxSize: 2,
    })

    // tickSize: 1
    const aggregated3 = aggregateLevels(levels, 999, 1, floorToTick)

    expect(aggregated3).toEqual({
      aggregatedLevels: [
        { price: 1001, size: 2, cumSize: 2 },
        { price: 1000, size: 11, cumSize: 13 },
      ],
      maxSize: 2,
    })

    // tickSize: 10
    const aggregated4 = aggregateLevels(levels, 999, 10, floorToTick)

    expect(aggregated4).toEqual({ aggregatedLevels: [{ price: 1000, size: 13, cumSize: 13 }], maxSize: 2 })
  })
  it('can aggregate asks', () => {
    const levels: OBLevel[] = [
      {
        price: 1000,
        size: 1,
        cumSize: 1,
      },
      {
        price: 1000.1,
        size: 1,
        cumSize: 2,
      },
      {
        price: 1000.2,
        size: 1,
        cumSize: 3,
      },
      {
        price: 1000.3,
        size: 1,
        cumSize: 4,
      },
      {
        price: 1000.4,
        size: 1,
        cumSize: 5,
      },
      {
        price: 1000.5,
        size: 1,
        cumSize: 6,
      },
      {
        price: 1000.6,
        size: 1,
        cumSize: 7,
      },
      {
        price: 1000.7,
        size: 1,
        cumSize: 8,
      },
      {
        price: 1000.8,
        size: 1,
        cumSize: 9,
      },
      {
        price: 1000.9,
        size: 1,
        cumSize: 10,
      },
      {
        price: 1001.0,
        size: 1,
        cumSize: 11,
      },
      {
        price: 1001.1,
        size: 2,
        cumSize: 13,
      },
    ]

    // tickSize: baseTickSize
    // No change (base tick size)
    // Note: It's better to just not call the fn.
    const aggregated1 = aggregateLevels(levels, 999, 0.1, ceilToTick)

    expect(aggregated1).toEqual({
      aggregatedLevels: levels,
      maxSize: 2,
    })

    // tickSize: 0.5
    const aggregated2 = aggregateLevels(levels, 999, 0.5, ceilToTick)

    expect(aggregated2).toEqual({
      aggregatedLevels: [
        { price: 1000, size: 1, cumSize: 1 },
        { price: 1000.5, size: 5, cumSize: 6 },
        { price: 1001, size: 5, cumSize: 11 },
        { price: 1001.5, size: 2, cumSize: 13 },
      ],
      maxSize: 2,
    })

    // tickSize: 1
    const aggregated3 = aggregateLevels(levels, 999, 1, ceilToTick)

    expect(aggregated3).toEqual({
      aggregatedLevels: [
        { price: 1000, size: 1, cumSize: 1 },
        { price: 1001, size: 10, cumSize: 11 },
        { price: 1002, size: 2, cumSize: 13 },
      ],
      maxSize: 2,
    })

    // tickSize: 10
    const aggregated4 = aggregateLevels(levels, 999, 10, ceilToTick)

    expect(aggregated4).toEqual({
      aggregatedLevels: [
        { price: 1000, size: 1, cumSize: 1 },
        { price: 1010, size: 12, cumSize: 13 },
      ],
      maxSize: 2,
    })
  })
})
