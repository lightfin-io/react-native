import { floorToTick, ceilToTick } from '../../../utils'
import { OBLevel } from '../../../types'

// Aggregates in 1 iteration.
export function aggregateLevels(
  levels: OBLevel[],
  maxLevelsPerSide: number,
  tickSize: number,
  roundFn: (n: number, tickSize: number) => number
) {
  if (!levels.length) {
    return {
      aggregatedLevels: levels,
      maxSize: 0,
    }
  }

  let cumSize = 0
  let maxSize = 0
  let currLevel: OBLevel = {
    price: 0,
    size: 0,
    cumSize: 0,
  }
  const aggregatedLevels: OBLevel[] = [currLevel]

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]
    cumSize += level.size
    const roundedPrice = roundFn(level.price, tickSize)

    if (currLevel.price === 0 || roundedPrice === currLevel.price) {
      // Add to current level.
      currLevel.price = roundedPrice
      currLevel.size += level.size
      currLevel.cumSize = cumSize
    } else {
      // Create and push new level.
      currLevel = {
        price: roundedPrice,
        size: level.size,
        cumSize,
      }
      aggregatedLevels.push(currLevel)
    }

    // Update largest level size.
    if (maxSize < level.size) {
      maxSize = level.size
    }

    // Exit if reached max levels.
    if (maxLevelsPerSide === aggregatedLevels.length) {
      break
    }
  }

  return {
    aggregatedLevels,
    maxSize,
  }
}

function getMaxSize(levels: OBLevel[]) {
  return levels.reduce((max, level) => Math.max(level.size, max), 0)
}

function sumAndSlice(bids: OBLevel[], asks: OBLevel[], maxLevelsPerSide: number) {
  const slicedBids = bids.slice(0, maxLevelsPerSide)
  const slicedAsks = asks.slice(0, maxLevelsPerSide)
  const maxBidSize = getMaxSize(slicedBids)
  const maxAskSize = getMaxSize(slicedAsks)

  return {
    bids: slicedBids,
    asks: slicedAsks,
    maxBidSize,
    maxAskSize,
  }
}

export function useAggregatedBook(
  bids: OBLevel[],
  asks: OBLevel[],
  baseTickSize: number,
  tickSize: number,
  maxLevelsPerSide: number
) {
  if (baseTickSize === tickSize) {
    return sumAndSlice(bids, asks, maxLevelsPerSide)
  }

  const { aggregatedLevels: aggregatedBids, maxSize: maxBidSize } = aggregateLevels(
    bids,
    maxLevelsPerSide,
    tickSize,
    floorToTick
  )

  const { aggregatedLevels: aggregatedAsks, maxSize: maxAskSize } = aggregateLevels(
    bids,
    maxLevelsPerSide,
    tickSize,
    ceilToTick
  )

  return {
    bids: aggregatedBids,
    asks: aggregatedAsks,
    maxBidSize,
    maxAskSize,
  }
}
