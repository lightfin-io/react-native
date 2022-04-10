export function getMidPrice(bestBid: number, bestAsk: number) {
  if (!bestBid) {
    return bestAsk
  }
  if (!bestAsk) {
    return bestBid
  }

  return (bestBid + bestAsk) / 2
}
