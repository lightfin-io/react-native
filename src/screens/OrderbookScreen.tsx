import React, { useState } from 'react'

import { Orderbook } from '../lib'
import { useBinanceOrderbook } from '../hooks'

const baseTickSize = 0.01 // Binance BTCBUSD ticksize
const tickSizes = [baseTickSize, baseTickSize * 5, baseTickSize * 10, baseTickSize * 50, baseTickSize * 100]

export function OrderbookScreen() {
  const { bids, asks } = useBinanceOrderbook('BTCBUSD')
  const [tickSize, setTickSize] = useState(baseTickSize)
  return (
    <Orderbook
      bids={bids}
      asks={asks}
      aggregation={{
        baseTickSize,
        tickSizes,
        tickSize,
        onTickSizeChange: setTickSize,
      }}
      sizeLabel="Size (BTC)"
    />
  )
}
