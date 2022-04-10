import React from 'react'

import { MarketDepthChart } from '../lib'
import { useBinanceOrderbook } from '../hooks'

export function MarketDepthChartScreen() {
  const { bids, asks } = useBinanceOrderbook('BTCBUSD')
  return <MarketDepthChart bids={bids} asks={asks} />
}
