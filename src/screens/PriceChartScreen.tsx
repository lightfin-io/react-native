import React, { useRef } from 'react'

import { PriceChart } from '../lib'
import { useBinanceCandles } from '../hooks'

export function PriceChartScreen() {
  const startTime = useRef(Date.now() - 3600 * 1000)
  const endTime = useRef(Date.now())
  useBinanceCandles('BTCBUSD', '1m', startTime.current, endTime.current)
  return <PriceChart />
}
